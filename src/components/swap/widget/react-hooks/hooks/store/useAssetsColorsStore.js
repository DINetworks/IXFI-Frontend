import { create } from 'zustand'

const initialState = {
  chains: {},
  tokens: {}
}

export const useAssetsColorsStore = create(() => initialState)
