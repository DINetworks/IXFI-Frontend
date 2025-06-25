import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useFavoriteTokensStore = create(
  persist(
    (set, get) => ({
      favoriteTokens: [],
      addFavoriteToken(token) {
        set(state => ({
          favoriteTokens: [...state.favoriteTokens, token]
        }))
      },
      removeFavoriteToken(token) {
        set(state => ({
          favoriteTokens: state.favoriteTokens.filter(t => t.chainId !== token.chainId || t.address !== token.address)
        }))
      },
      toggleFavoriteToken(token) {
        const isFavorite = get().favoriteTokens.some(t => t.chainId === token.chainId && t.address === token.address)
        if (isFavorite) {
          get().removeFavoriteToken(token)
        } else {
          get().addFavoriteToken(token)
        }
      }
    }),
    {
      name: 'squid.favorite.tokens.store',
      version: 1
    }
  )
)
