export default defineAppConfig({
  ui: {
    colors: {
      primary: '#0f172b',
      neutral: 'gray'
    },
    icons: {
      loading: 'mingcute:loading-line'
    },
    input: {
      slots: {
        base: 'disabled:bg-elevated'
      }
    },
    textarea: {
      slots: {
        base: 'disabled:bg-elevated'
      }
    },
    select: {
      slots: {
        base: 'disabled:bg-elevated'
      }
    },
    inputMenu: {
      slots: {
        base: 'disabled:bg-elevated'
      }
    }
  }
})
