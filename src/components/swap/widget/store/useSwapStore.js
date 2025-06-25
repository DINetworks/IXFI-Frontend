import { create } from 'zustand'

export const useSwapThemeStore = create(() => ({}))

export const useSwapRouterStore = create(() => ({
  transition: {
    inProgress: false,
    isNewRoute: false
  },
  isModalOpen: false,
  history: [
    {
      route: {
        id: 'swap',
        path: '/',
        title: 'Swap'
      }
    }
  ]
}))

export const useSwapLabelsStore = create(() => ({}))
