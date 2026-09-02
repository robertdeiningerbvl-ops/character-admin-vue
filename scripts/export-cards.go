package main

import (
	"bufio"
	"bytes"
	"encoding/base64"
	"encoding/binary"
	"encoding/json"
	"flag"
	"fmt"
	"hash/crc32"
	"image"
	_ "image/gif"
	_ "image/jpeg"
	"image/png"
	"io"
	"net/http"
	"net/url"
	"os"
	"path/filepath"
	"regexp"
	"strconv"
	"strings"
	"sync"
	"time"
)

type Config struct {
	apiURL       string
	token        string
	outputDir    string
	limit        int
	pageSize     int
	seeking      int
	delayMs      int
	id           string
	name         string
	skipExisting bool
	dryRun       bool
}

type listResponse struct {
	Count int                      `json:"count"`
	List  []map[string]interface{} `json:"list"`
}

type detailResponse struct {
	Body string                 `json:"body"`
	Item map[string]interface{} `json:"item"`
}

type exportCard struct {
	Spec        string        `json:"spec"`
	SpecVersion string        `json:"spec_version"`
	Name        string        `json:"name"`
	Anohana     exportAnohana `json:"anohana"`
	Data        exportData    `json:"data"`
}

type exportAnohana struct {
	Image     string   `json:"image"`
	Avatar    string   `json:"avatar"`
	Images    []string `json:"images"`
	Source    bool     `json:"source"`
	SourceURL string   `json:"source_url"`
	Summary   string   `json:"summary"`
	Anonymous bool     `json:"anonymous"`
	Nsfw      bool     `json:"nsfw"`
	Guide     []string `json:"guide"`
}

type exportData struct {
	Name               string                   `json:"name"`
	Description        string                   `json:"description"`
	Personality        string                   `json:"personality"`
	Scenario           string                   `json:"scenario"`
	MesExample         string                   `json:"mes_example"`
	FirstMes           string                   `json:"first_mes"`
	AlternateGreetings []string                 `json:"alternate_greetings"`
	CreatorNotes       string                   `json:"creator_notes"`
	SystemPrompt       string                   `json:"system_prompt"`
	Creator            string                   `json:"creator"`
	Tags               []string                 `json:"tags"`
	CharacterBook      *exportCharacterBook     `json:"character_book,omitempty"`
	Regex              []map[string]interface{} `json:"regex,omitempty"`
}

type exportCharacterBook struct {
	Name    string                   `json:"name"`
	Entries []map[string]interface{} `json:"entries"`
}

type exportResult struct {
	status  string
	message string
}

type failureItem struct {
	id     string
	name   string
	reason string
}

type exportTask struct {
	index int
	item  map[string]interface{}
}

type exportOutcome struct {
	index  int
	id     string
	name   string
	result exportResult
	err    error
}

func main() {
	cfg, help, err := parseConfig(os.Args[1:])
	if err != nil {
		fmt.Fprintf(os.Stderr, "参数错误: %v\n", err)
		os.Exit(1)
	}
	if help {
		return
	}

	if err := run(cfg); err != nil {
		fmt.Fprintf(os.Stderr, "导出失败: %v\n", err)
		os.Exit(1)
	}
}

func parseConfig(args []string) (*Config, bool, error) {
	dotEnv := loadDotEnv()
	lookup := func(keys ...string) string {
		for _, key := range keys {
			if value := os.Getenv(key); value != "" {
				return value
			}
			if value := dotEnv[key]; value != "" {
				return value
			}
		}
		return ""
	}

	fs := flag.NewFlagSet("export-cards", flag.ContinueOnError)
	fs.SetOutput(os.Stderr)

	apiURL := fs.String("api-url", lookup("BATCH_EXPORT_API_URL", "API_BASE_URL"), "后台接口地址")
	token := fs.String("token", lookup("BATCH_EXPORT_TOKEN"), "后台 token")
	outputDir := fs.String("output-dir", firstNonEmpty(lookup("BATCH_EXPORT_OUTPUT_DIR"), "./exports/cards"), "导出目录")
	limit := fs.Int("limit", intFromEnv(lookup("BATCH_EXPORT_LIMIT"), 0), "最多导出卡片数，0 表示不限制")
	pageSize := fs.Int("page-size", intFromEnv(lookup("BATCH_EXPORT_PAGE_SIZE"), 100), "列表每页数量")
	seeking := fs.Int("seeking", intFromEnv(lookup("BATCH_EXPORT_SEEKING"), 0), "列表 seeking 过滤")
	delayMs := fs.Int("delay", intFromEnv(lookup("BATCH_EXPORT_DELAY"), 200), "每张卡之间的延迟毫秒数")
	skipExisting := fs.Bool("skip-existing", boolFromEnv(lookup("BATCH_EXPORT_SKIP_EXISTING"), true), "跳过已存在文件")
	dryRun := fs.Bool("dry-run", boolFromEnv(lookup("BATCH_EXPORT_DRY_RUN"), false), "只检查，不下载图片和写文件")
	id := fs.String("id", "", "只导出指定角色卡 ID")
	name := fs.String("name", "", "按角色卡名称筛选")
	help := fs.Bool("help", false, "显示帮助")

	fs.Usage = func() {
		fmt.Fprint(fs.Output(), `批量导出角色卡 PNG 脚本（Go）

用法：
  go run scripts/export-cards.go [选项]

环境变量：
  BATCH_EXPORT_API_URL      后台接口地址，例如 http://127.0.0.1:3001
  BATCH_EXPORT_TOKEN        后台 token，对应登录后的 localStorage token
  BATCH_EXPORT_OUTPUT_DIR   导出目录，默认 ./exports/cards
  BATCH_EXPORT_LIMIT        最多导出卡片数，0 表示不限制
  BATCH_EXPORT_PAGE_SIZE    列表每页数量，默认 100
  BATCH_EXPORT_SEEKING      列表 seeking 过滤，默认 0 表示全部
  BATCH_EXPORT_DELAY        每张卡之间的延迟毫秒数，默认 200
  BATCH_EXPORT_SKIP_EXISTING 是否跳过已存在文件，默认 true

说明：
  脚本固定使用 20 个并发 worker 处理角色卡导出。

常用选项：
  --api-url=URL
  --token=TOKEN
  --output-dir=PATH
  --limit=N
  --page-size=N
  --seeking=N
  --delay=200
  --skip-existing=false
  --dry-run
  --id=N
  --name=关键词
  --help
`)
	}

	if err := fs.Parse(args); err != nil {
		if err == flag.ErrHelp {
			return nil, true, nil
		}
		return nil, false, err
	}
	if *help {
		fs.Usage()
		return nil, true, nil
	}
	if strings.TrimSpace(*apiURL) == "" {
		return nil, false, fmt.Errorf("缺少 API 地址，请设置 BATCH_EXPORT_API_URL 或通过 --api-url 传入")
	}

	return &Config{
		apiURL:       strings.TrimRight(strings.TrimSpace(*apiURL), "/"),
		token:        strings.TrimSpace(*token),
		outputDir:    absolutePath(strings.TrimSpace(*outputDir)),
		limit:        *limit,
		pageSize:     *pageSize,
		seeking:      *seeking,
		delayMs:      *delayMs,
		id:           strings.TrimSpace(*id),
		name:         strings.TrimSpace(*name),
		skipExisting: *skipExisting,
		dryRun:       *dryRun,
	}, false, nil
}

func loadDotEnv() map[string]string {
	result := map[string]string{}
	for _, fileName := range []string{".env", ".env.local"} {
		file, err := os.Open(fileName)
		if err != nil {
			continue
		}
		scanner := bufio.NewScanner(file)
		for scanner.Scan() {
			line := strings.TrimSpace(scanner.Text())
			if line == "" || strings.HasPrefix(line, "#") {
				continue
			}
			equalIndex := strings.IndexByte(line, '=')
			if equalIndex == -1 {
				continue
			}
			key := strings.TrimSpace(line[:equalIndex])
			value := strings.TrimSpace(line[equalIndex+1:])
			if len(value) >= 2 {
				if (value[0] == '"' && value[len(value)-1] == '"') || (value[0] == '\'' && value[len(value)-1] == '\'') {
					value = value[1 : len(value)-1]
				}
			}
			if key != "" {
				result[key] = value
			}
		}
		_ = file.Close()
	}
	return result
}

func firstNonEmpty(values ...string) string {
	for _, value := range values {
		if value != "" {
			return value
		}
	}
	return ""
}

func intFromEnv(value string, fallback int) int {
	if value == "" {
		return fallback
	}
	parsed, err := strconv.Atoi(value)
	if err != nil || parsed < 0 {
		return fallback
	}
	return parsed
}

func boolFromEnv(value string, fallback bool) bool {
	if value == "" {
		return fallback
	}
	switch strings.ToLower(value) {
	case "1", "true", "yes", "on":
		return true
	case "0", "false", "no", "off":
		return false
	default:
		return fallback
	}
}

func absolutePath(value string) string {
	absolute, err := filepath.Abs(value)
	if err != nil {
		return value
	}
	return absolute
}

const exportWorkerCount = 20

func run(cfg *Config) error {
	logf("API: %s", cfg.apiURL)
	logf("Token: %s", maskToken(cfg.token))
	logf("输出目录: %s", cfg.outputDir)
	logf("限制数量: %s", limitText(cfg.limit))
	logf("并发数: %d", exportWorkerCount)
	if cfg.dryRun {
		logf("Dry run：只检查，不下载图片和写文件")
	}

	stats := struct {
		total           int
		success         int
		skippedNoImage  int
		skippedExisting int
		dryRun          int
		failed          int
	}{}
	failures := []failureItem{}

	tasks := make(chan exportTask)
	outcomes := make(chan exportOutcome)
	workerDone := make(chan struct{})

	var workers sync.WaitGroup
	for i := 0; i < exportWorkerCount; i++ {
		workers.Add(1)
		go func() {
			defer workers.Done()
			exportWorker(cfg, tasks, outcomes)
		}()
	}

	go func() {
		workers.Wait()
		close(outcomes)
		close(workerDone)
	}()

	var aggregator sync.WaitGroup
	aggregator.Add(1)
	go func() {
		defer aggregator.Done()
		for outcome := range outcomes {
			processOutcome(outcome, cfg, &stats, &failures)
		}
	}()

	page := 1
	processed := 0
	total := 0

	produceTasks := func() error {
		for {
			params := url.Values{}
			params.Set("page", strconv.Itoa(page))
			params.Set("pagesize", strconv.Itoa(cfg.pageSize))
			if cfg.seeking > 0 {
				params.Set("seeking", strconv.Itoa(cfg.seeking))
			}
			if cfg.id != "" {
				params.Set("id", cfg.id)
			}
			if cfg.name != "" {
				params.Set("name", cfg.name)
			}

			listData, err := apiGet(cfg, "amusement-list", params)
			if err != nil {
				return err
			}
			var list listResponse
			if err := json.Unmarshal(listData, &list); err != nil {
				return fmt.Errorf("解析 amusement-list 返回失败: %w", err)
			}

			if page == 1 {
				total = list.Count
				if total == 0 {
					total = len(list.List)
				}
				stats.total = total
				logf("列表总数: %d", total)
			}

			if len(list.List) == 0 {
				return nil
			}

			for _, item := range list.List {
				if cfg.limit > 0 && processed >= cfg.limit {
					return nil
				}
				processed++
				tasks <- exportTask{index: processed, item: item}
			}

			if cfg.limit > 0 && processed >= cfg.limit {
				return nil
			}
			if total > 0 && processed >= total {
				return nil
			}
			if len(list.List) < cfg.pageSize {
				return nil
			}
			page++
		}
	}

	if err := produceTasks(); err != nil {
		close(tasks)
		<-workerDone
		aggregator.Wait()
		return err
	}

	close(tasks)
	<-workerDone
	aggregator.Wait()

	logf("完成")
	logf("成功: %d", stats.success)
	logf("缺少背景图: %d", stats.skippedNoImage)
	logf("已存在跳过: %d", stats.skippedExisting)
	if stats.dryRun > 0 {
		logf("Dry run 检查: %d", stats.dryRun)
	}
	logf("失败: %d", stats.failed)

	if len(failures) > 0 {
		warnf("失败明细：")
		for _, failure := range failures {
			warnf("- [%s] %s: %s", failure.id, failure.name, failure.reason)
		}
	}

	return nil
}

func exportWorker(cfg *Config, tasks <-chan exportTask, outcomes chan<- exportOutcome) {
	for task := range tasks {
		id := stringifyID(task.item["id"])
		name := asString(task.item["name"])
		if name == "" {
			name = "ID:" + id
		}

		result, err := exportOneCard(cfg, task.item)
		outcomes <- exportOutcome{
			index:  task.index,
			id:     id,
			name:   name,
			result: result,
			err:    err,
		}

		if cfg.delayMs > 0 {
			time.Sleep(time.Duration(cfg.delayMs) * time.Millisecond)
		}
	}
}

func processOutcome(outcome exportOutcome, cfg *Config, stats *struct {
	total           int
	success         int
	skippedNoImage  int
	skippedExisting int
	dryRun          int
	failed          int
}, failures *[]failureItem) {
	denominator := progressTotal(cfg.limit, stats.total)

	if outcome.err != nil {
		stats.failed++
		*failures = append(*failures, failureItem{id: outcome.id, name: outcome.name, reason: outcome.err.Error()})
		warnf("[%d/%s] 失败 %s: %v", outcome.index, denominator, outcome.name, outcome.err)
		return
	}

	switch outcome.result.status {
	case "success":
		stats.success++
		logf("[%d/%s] 成功 %s -> %s", outcome.index, denominator, outcome.name, outcome.result.message)
	case "skip-no-image":
		stats.skippedNoImage++
		warnf("[%d/%s] 跳过 %s: %s", outcome.index, denominator, outcome.name, outcome.result.message)
	case "skip-existing":
		stats.skippedExisting++
		logf("[%d/%s] 跳过 %s: %s", outcome.index, denominator, outcome.name, outcome.result.message)
	case "dry-run":
		stats.dryRun++
		logf("[%d/%s] 检查 %s: %s", outcome.index, denominator, outcome.name, outcome.result.message)
	}
}

func exportOneCard(cfg *Config, item map[string]interface{}) (exportResult, error) {
	id := stringifyID(item["id"])
	detailData, err := apiGet(cfg, "amusement-edit-info", url.Values{"biz_id": []string{id}})
	if err != nil {
		return exportResult{}, err
	}

	var detail detailResponse
	if err := json.Unmarshal(detailData, &detail); err != nil {
		return exportResult{}, fmt.Errorf("解析 amusement-edit-info 返回失败: %w", err)
	}

	rawCard, err := resolveCardBody(detail, item)
	if err != nil {
		return exportResult{}, err
	}

	card := normalizeCard(rawCard, item)
	name := card.Name
	if name == "" {
		name = asString(item["name"])
	}
	if name == "" {
		name = "character-" + id
	}

	imageURL := resolveMediaURL(card.Anohana.Image, cfg.apiURL)
	if imageURL == "" {
		return exportResult{status: "skip-no-image", message: "缺少背景图"}, nil
	}

	fileName := safeFileName(id, name)
	filePath := filepath.Join(cfg.outputDir, fileName)

	if !cfg.dryRun && cfg.skipExisting {
		if _, err := os.Stat(filePath); err == nil {
			return exportResult{status: "skip-existing", message: "文件已存在"}, nil
		}
	}

	if cfg.dryRun {
		return exportResult{status: "dry-run", message: "将导出 " + fileName}, nil
	}

	imageBytes, err := downloadImage(imageURL, cfg.token)
	if err != nil {
		return exportResult{}, err
	}

	pngBytes, err := decodeToPNG(imageBytes)
	if err != nil {
		return exportResult{}, err
	}

	cardJSON, err := json.Marshal(card)
	if err != nil {
		return exportResult{}, fmt.Errorf("序列化角色卡失败: %w", err)
	}
	base64Data := base64.StdEncoding.EncodeToString(cardJSON)

	pngWithChunk, err := insertPngTextChunk(pngBytes, "chara", base64Data)
	if err != nil {
		return exportResult{}, err
	}

	if err := os.MkdirAll(cfg.outputDir, 0o755); err != nil {
		return exportResult{}, fmt.Errorf("创建输出目录失败: %w", err)
	}
	if err := os.WriteFile(filePath, pngWithChunk, 0o644); err != nil {
		return exportResult{}, fmt.Errorf("写入文件失败: %w", err)
	}

	return exportResult{status: "success", message: fileName}, nil
}

func resolveCardBody(detail detailResponse, item map[string]interface{}) (map[string]interface{}, error) {
	if strings.TrimSpace(detail.Body) != "" {
		var body map[string]interface{}
		if err := json.Unmarshal([]byte(detail.Body), &body); err != nil {
			return nil, fmt.Errorf("详情 body 不是合法 JSON: %w", err)
		}
		return body, nil
	}

	if len(detail.Item) > 0 {
		return itemFallbackCard(detail.Item), nil
	}
	if len(item) > 0 {
		return itemFallbackCard(item), nil
	}

	return nil, fmt.Errorf("未找到可用的角色卡内容")
}

func itemFallbackCard(item map[string]interface{}) map[string]interface{} {
	imageURL := asString(item["image"])
	avatarURL := asString(item["avatar"])
	if avatarURL == "" {
		avatarURL = imageURL
	}

	return map[string]interface{}{
		"name": asString(item["name"]),
		"data": map[string]interface{}{
			"name":                asString(item["name"]),
			"description":         asString(item["summary"]),
			"personality":         "",
			"scenario":            "",
			"mes_example":         "",
			"first_mes":           "",
			"alternate_greetings": []interface{}{},
			"creator_notes":       "",
			"system_prompt":       "",
			"creator":             asString(item["username"]),
			"tags":                normalizeTags(item["tags"]),
		},
		"anohana": map[string]interface{}{
			"image":      imageURL,
			"avatar":     avatarURL,
			"images":     []interface{}{},
			"source":     asBool(item["source"]),
			"source_url": asString(item["source_url"]),
			"summary":    asString(item["summary"]),
			"anonymous":  asBool(item["anonymous"]),
			"nsfw":       asBool(item["nsfw"]),
			"guide":      []interface{}{},
		},
	}
}

func normalizeCard(raw map[string]interface{}, item map[string]interface{}) exportCard {
	data := asMap(raw["data"])
	anohana := asMap(raw["anohana"])

	name := asString(data["name"])
	if name == "" {
		name = asString(raw["name"])
	}
	if name == "" {
		name = asString(item["name"])
	}

	imageURL := asString(anohana["image"])
	if imageURL == "" {
		imageURL = asString(item["image"])
	}
	avatarURL := asString(anohana["avatar"])
	if avatarURL == "" {
		avatarURL = imageURL
	}

	summary := asString(anohana["summary"])
	if summary == "" {
		summary = asString(data["summary"])
	}
	if summary == "" {
		summary = asString(item["summary"])
	}

	creator := asString(data["creator"])
	if creator == "" {
		creator = asString(item["username"])
	}

	firstMes := asString(data["first_mes"])
	alternateGreetings := filterStrings(asStringSlice(data["alternate_greetings"]))
	allGreetings := []string{}
	if firstMes != "" {
		allGreetings = append(allGreetings, firstMes)
	}
	allGreetings = append(allGreetings, alternateGreetings...)

	tags := normalizeTags(data["tags"])
	if len(tags) == 0 {
		tags = normalizeTags(item["tags"])
	}

	return exportCard{
		Spec:        "chara_card_v2",
		SpecVersion: "2.0",
		Name:        name,
		Anohana: exportAnohana{
			Image:     imageURL,
			Avatar:    avatarURL,
			Images:    asStringSlice(anohana["images"]),
			Source:    asBool(anohana["source"]),
			SourceURL: asString(anohana["source_url"]),
			Summary:   summary,
			Anonymous: asBool(anohana["anonymous"]),
			Nsfw:      asBool(anohana["nsfw"]),
			Guide:     normalizeGuide(anohana["guide"]),
		},
		Data: exportData{
			Name:               name,
			Description:        asString(data["description"]),
			Personality:        asString(data["personality"]),
			Scenario:           asString(data["scenario"]),
			MesExample:         asString(data["mes_example"]),
			FirstMes:           firstMes,
			AlternateGreetings: alternateGreetings,
			CreatorNotes:       asString(data["creator_notes"]),
			SystemPrompt:       asString(data["system_prompt"]),
			Creator:            creator,
			Tags:               tags,
			CharacterBook:      normalizeCharacterBook(data, name),
			Regex:              normalizeRegex(data["regex"]),
		},
	}
}

func apiGet(cfg *Config, route string, params url.Values) ([]byte, error) {
	endpoint := adminBase(cfg.apiURL) + "/" + route
	if len(params) > 0 {
		endpoint += "?" + params.Encode()
	}

	req, err := http.NewRequest(http.MethodGet, endpoint, nil)
	if err != nil {
		return nil, err
	}
	req.Header.Set("Accept", "*/*")
	req.Header.Set("User-Agent", "character-admin-vue/go-export-cards")
	if cfg.token != "" {
		req.Header.Set("token", cfg.token)
	}

	client := &http.Client{Timeout: 30 * time.Second}
	resp, err := client.Do(req)
	if err != nil {
		return nil, fmt.Errorf("请求接口失败 %s: %w", route, err)
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, fmt.Errorf("读取接口响应失败 %s: %w", route, err)
	}
	if resp.StatusCode < 200 || resp.StatusCode >= 300 {
		return nil, fmt.Errorf("接口请求失败 %s (HTTP %d): %s", route, resp.StatusCode, strings.TrimSpace(string(body)))
	}

	var envelope struct {
		Code int             `json:"code"`
		Data json.RawMessage `json:"data"`
		Msg  string          `json:"msg"`
	}
	if err := json.Unmarshal(body, &envelope); err != nil {
		return nil, fmt.Errorf("接口返回不是合法 JSON %s: %w", route, err)
	}
	if envelope.Code != 1 {
		message := envelope.Msg
		if message == "" {
			message = fmt.Sprintf("code=%d", envelope.Code)
		}
		return nil, fmt.Errorf("接口调用失败 %s: %s", route, message)
	}

	return []byte(envelope.Data), nil
}

func adminBase(apiURL string) string {
	if strings.HasSuffix(apiURL, "/admin") {
		return apiURL
	}
	return apiURL + "/admin"
}

func resolveMediaURL(raw string, apiURL string) string {
	if raw == "" {
		return ""
	}
	if strings.HasPrefix(raw, "http://") || strings.HasPrefix(raw, "https://") || strings.HasPrefix(raw, "data:") {
		return raw
	}

	root := apiRoot(apiURL)
	base, err := url.Parse(strings.TrimRight(root, "/") + "/")
	if err != nil {
		return raw
	}
	ref, err := url.Parse(raw)
	if err != nil {
		return raw
	}
	return base.ResolveReference(ref).String()
}

func apiRoot(apiURL string) string {
	if strings.HasSuffix(apiURL, "/admin") {
		return strings.TrimSuffix(apiURL, "/admin")
	}
	return apiURL
}

func downloadImage(rawURL string, token string) ([]byte, error) {
	if strings.HasPrefix(rawURL, "data:") {
		return decodeDataURL(rawURL)
	}

	req, err := http.NewRequest(http.MethodGet, rawURL, nil)
	if err != nil {
		return nil, err
	}
	req.Header.Set("Accept", "*/*")
	req.Header.Set("User-Agent", "character-admin-vue/go-export-cards")
	if token != "" {
		req.Header.Set("token", token)
	}

	client := &http.Client{Timeout: 30 * time.Second}
	resp, err := client.Do(req)
	if err != nil {
		return nil, fmt.Errorf("图片下载失败 %s: %w", rawURL, err)
	}
	defer resp.Body.Close()

	if resp.StatusCode < 200 || resp.StatusCode >= 300 {
		return nil, fmt.Errorf("图片下载失败(HTTP %d): %s", resp.StatusCode, rawURL)
	}
	return io.ReadAll(resp.Body)
}

func decodeDataURL(rawURL string) ([]byte, error) {
	commaIndex := strings.Index(rawURL, ",")
	if commaIndex == -1 {
		return nil, fmt.Errorf("data URL 格式错误")
	}
	metadata := rawURL[:commaIndex]
	data := rawURL[commaIndex+1:]
	if strings.Contains(metadata, ";base64") {
		return base64.StdEncoding.DecodeString(data)
	}
	decoded, err := url.PathUnescape(data)
	if err != nil {
		return nil, err
	}
	return []byte(decoded), nil
}

func decodeToPNG(imageBytes []byte) ([]byte, error) {
	img, _, err := image.Decode(bytes.NewReader(imageBytes))
	if err != nil {
		return nil, fmt.Errorf("图片解码失败: %w", err)
	}

	var output bytes.Buffer
	if err := png.Encode(&output, img); err != nil {
		return nil, fmt.Errorf("图片编码为 PNG 失败: %w", err)
	}
	return output.Bytes(), nil
}

func insertPngTextChunk(pngData []byte, keyword string, text string) ([]byte, error) {
	if len(pngData) < 8 {
		return nil, fmt.Errorf("PNG 数据长度不足")
	}

	chunkType := []byte("tEXt")
	chunkData := []byte(keyword + "\x00" + text)
	chunk := make([]byte, 12+len(chunkData))
	binary.BigEndian.PutUint32(chunk[0:4], uint32(len(chunkData)))
	copy(chunk[4:8], chunkType)
	copy(chunk[8:8+len(chunkData)], chunkData)

	crcData := make([]byte, 0, len(chunkType)+len(chunkData))
	crcData = append(crcData, chunkType...)
	crcData = append(crcData, chunkData...)
	binary.BigEndian.PutUint32(chunk[8+len(chunkData):], crc32.ChecksumIEEE(crcData))

	insertPos := 8
	foundIHDR := false
	for insertPos < len(pngData)-12 {
		length := int(binary.BigEndian.Uint32(pngData[insertPos : insertPos+4]))
		chunkTypeName := string(pngData[insertPos+4 : insertPos+8])
		insertPos += 12 + length
		if chunkTypeName == "IHDR" {
			foundIHDR = true
			break
		}
	}
	if !foundIHDR {
		return nil, fmt.Errorf("PNG 中未找到 IHDR")
	}

	result := make([]byte, 0, len(pngData)+len(chunk))
	result = append(result, pngData[:insertPos]...)
	result = append(result, chunk...)
	result = append(result, pngData[insertPos:]...)
	return result, nil
}

func normalizeGuide(value interface{}) []string {
	items := asSlice(value)
	result := []string{}
	for _, item := range items {
		switch typed := item.(type) {
		case string:
			if strings.TrimSpace(typed) != "" {
				result = append(result, typed)
			}
		case map[string]interface{}:
			content := asString(typed["content"])
			if strings.TrimSpace(content) != "" {
				result = append(result, content)
			}
		}
	}
	return result
}

func normalizeTags(value interface{}) []string {
	items := asSlice(value)
	result := []string{}
	for _, item := range items {
		if tag := asString(item); tag != "" {
			result = append(result, tag)
		}
	}
	if len(result) == 0 {
		if tagString, ok := value.(string); ok && tagString != "" {
			for _, tag := range strings.Split(tagString, ",") {
				tag = strings.TrimSpace(tag)
				if tag != "" {
					result = append(result, tag)
				}
			}
		}
	}
	return result
}

func normalizeCharacterBook(data map[string]interface{}, fallbackName string) *exportCharacterBook {
	characterBook := asMap(data["character_book"])
	entries := asSlice(characterBook["entries"])
	if len(entries) == 0 {
		return nil
	}

	name := asString(characterBook["name"])
	if name == "" {
		name = fallbackName + "的世界书"
	}

	normalizedEntries := []map[string]interface{}{}
	for _, entry := range entries {
		if entryMap, ok := entry.(map[string]interface{}); ok {
			normalizedEntries = append(normalizedEntries, entryMap)
		}
	}
	if len(normalizedEntries) == 0 {
		return nil
	}

	return &exportCharacterBook{
		Name:    name,
		Entries: normalizedEntries,
	}
}

func normalizeRegex(value interface{}) []map[string]interface{} {
	items := asSlice(value)
	result := []map[string]interface{}{}
	for index, item := range items {
		rule, ok := item.(map[string]interface{})
		if !ok {
			continue
		}
		entry := map[string]interface{}{}
		for key, val := range rule {
			entry[key] = val
		}
		if entry["id"] == nil || asString(entry["id"]) == "" {
			entry["id"] = strconv.Itoa(index + 1)
		} else {
			entry["id"] = stringifyID(entry["id"])
		}
		if _, ok := entry["placement"].([]interface{}); !ok {
			entry["placement"] = []interface{}{}
		}
		if _, ok := entry["trimStrings"].([]interface{}); !ok {
			entry["trimStrings"] = []interface{}{}
		}
		result = append(result, entry)
	}
	if len(result) == 0 {
		return nil
	}
	return result
}

func asMap(value interface{}) map[string]interface{} {
	if mapped, ok := value.(map[string]interface{}); ok {
		return mapped
	}
	return map[string]interface{}{}
}

func asSlice(value interface{}) []interface{} {
	if slice, ok := value.([]interface{}); ok {
		return slice
	}
	return []interface{}{}
}

func asStringSlice(value interface{}) []string {
	items := asSlice(value)
	result := make([]string, 0, len(items))
	for _, item := range items {
		if text := asString(item); text != "" {
			result = append(result, text)
		}
	}
	return result
}

func filterStrings(values []string) []string {
	result := []string{}
	for _, value := range values {
		if value != "" {
			result = append(result, value)
		}
	}
	return result
}

func asString(value interface{}) string {
	switch typed := value.(type) {
	case string:
		return typed
	case float64:
		return strconv.FormatFloat(typed, 'f', -1, 64)
	case float32:
		return strconv.FormatFloat(float64(typed), 'f', -1, 32)
	case int:
		return strconv.Itoa(typed)
	case int64:
		return strconv.FormatInt(typed, 10)
	case json.Number:
		return typed.String()
	case nil:
		return ""
	default:
		return fmt.Sprint(typed)
	}
}

func stringifyID(value interface{}) string {
	if value == nil {
		return ""
	}
	return asString(value)
}

func asBool(value interface{}) bool {
	switch typed := value.(type) {
	case bool:
		return typed
	case float64:
		return typed != 0
	case float32:
		return typed != 0
	case int:
		return typed != 0
	case int64:
		return typed != 0
	case string:
		return typed == "1" || strings.EqualFold(typed, "true")
	default:
		return false
	}
}

var invalidFileNameChars = regexp.MustCompile(`[\\/:*?"<>|\x00-\x1f]`)

func safeFileName(id string, name string) string {
	cleaned := invalidFileNameChars.ReplaceAllString(name, "_")
	cleaned = strings.Join(strings.Fields(cleaned), " ")
	cleaned = truncateRunes(cleaned, 80)
	if cleaned == "" {
		cleaned = "character"
	}
	return id + "-" + cleaned + ".png"
}

func truncateRunes(value string, limit int) string {
	runes := []rune(value)
	if len(runes) <= limit {
		return value
	}
	return string(runes[:limit])
}

func maskToken(token string) string {
	if token == "" {
		return "(empty)"
	}
	if len(token) <= 12 {
		return token[:1] + "..." + token[len(token)-1:]
	}
	return token[:8] + "..." + token[len(token)-4:]
}

func limitText(limit int) string {
	if limit == 0 {
		return "不限制"
	}
	return strconv.Itoa(limit)
}

func progressTotal(limit int, total int) string {
	if limit > 0 {
		return strconv.Itoa(limit)
	}
	return strconv.Itoa(total)
}

func logf(format string, args ...interface{}) {
	fmt.Printf("[export-cards] %s %s\n", time.Now().Format(time.RFC3339), fmt.Sprintf(format, args...))
}

func warnf(format string, args ...interface{}) {
	fmt.Fprintf(os.Stderr, "[export-cards] %s %s\n", time.Now().Format(time.RFC3339), fmt.Sprintf(format, args...))
}
