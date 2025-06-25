import { create } from 'zustand'

const DEFAULT_CONFIG = {
  enabledTabs: ['swap', 'buy', 'send'],
  currentTab: 'swap'
}

export const useTabStore = create(set => ({
  ...DEFAULT_CONFIG,
  setEnabledTabs: tabs => set({ enabledTabs: tabs }),
  setCurrentTab: tab => set({ currentTab: tab }),
  initializeTabs: config => {
    if (!config) {
      // Default behavior: only swap tab
      set(DEFAULT_CONFIG)
      return
    }
    const enabledTabs = Object.entries(config)
      .filter(([key, value]) => key !== 'defaultTab' && value === true)
      .map(([key]) => key)
    // Ensure at least one tab is enabled
    if (enabledTabs.length === 0) {
      enabledTabs.push('swap')
    }
    // Set default tab if specified and enabled
    const defaultTab = config.defaultTab && enabledTabs.includes(config.defaultTab) ? config.defaultTab : enabledTabs[0]
    set({
      enabledTabs,
      currentTab: defaultTab
    })
  }
}))
