export default {
  id: '',
  name: 'vfd',
  avatar: '/image//63ef84f8ad4301424680e6ac03e778e740ft13u.png',
  mes_example: '832',
  personality: '4732',
  system_prompt: '45',
  scenario: '98',
  description: '99',
  first_mes: '09',
  anonymous: false,
  tags: [
    '打折',
    '特惠'
  ],
  source: false,
  source_url: '',
  summary: '89',
  character_version: 'v0.123',
  alternate_greetings: [],
  regex: [
    {
      id: 'f83ce295-3cdb-4359-9512-d22511b8d861',
      name: '',
      pattern: '',
      replace: '',
      placement: 10,
      enabled: true,
      only_display: false,
      scriptName: '123',
      findRegex: '\\d\\',
      replaceString: '<span>fuck</span>',
      disabled: 0,
      markdownOnly: 2,
      promptOnly: 2
    }
  ],
  regex_enabled: 0,
  guide: [
    '123',
    '456',
    '789'
  ],
  world_name: '我是世界书',
  entries: [
    {
      extensions: {
        position: 4,
        role: 1,
        probability: 2,
        scan_depth: 3,
        depth: 4,
        case_sensitive: true,
        match_whole_words: true,
        prevent_recursion: true
      },
      comment: '1',
      keys: '444,32y546',
      content: 'fdlkmdvfl',
      position: 'after_char',
      label: '智能插入-用户视角',
      insertion_order: 1,
      enabled: true,
      use_regex: true,
      selective: true,
      constant: true
    },
    {
      extensions: {
        position: 0,
        role: 0,
        probability: 3,
        scan_depth: 2
      },
      keys: 'gfd,erlko',
      comment: '2',
      content: '~~~~~~~~~~~~~~~~~~',
      position: 'before_char',
      label: '角色卡前',
      insertion_order: 4
    }
  ]
}
