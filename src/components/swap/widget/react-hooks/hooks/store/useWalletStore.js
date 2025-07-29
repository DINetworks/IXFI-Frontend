import { ChainType } from '@0xsquid/squid-types'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { isEmptyObject } from '../../services'

export const ConnectingWalletStatus = {
  IDLE: 0,
  CONNECTING: 1,
  REJECTED: 2,
  0: 'IDLE',
  1: 'CONNECTING',
  2: 'REJECTED'
}

const initialWalletState = {
  // Initialize all chain types to an empty wallet object
  connectedWalletsByChainType: Object.values(ChainType).reduce(
    (acc, chainType) => ({
      ...acc,
      [chainType]: {}
    }),
    {}
  ),
  connectingWalletState: {
    wallet: undefined,
    status: ConnectingWalletStatus.IDLE
  },
  recentConnectorIds: {}
}

export const useWalletStore = create()(
  persist(
    set => ({
      ...initialWalletState,
      setConnectedWallet: (chainType, connectedWalletState) =>
        set(state => {
          return {
            connectedWalletsByChainType: {
              ...state.connectedWalletsByChainType,
              [chainType]: connectedWalletState
            },
            recentConnectorIds: {
              ...state.recentConnectorIds,
              [chainType]: connectedWalletState.wallet.connectorId
            }
          }
        }),
      setConnectingWallet: state => set({ connectingWalletState: state }),
      disconnectWallet: chainType =>
        set(state => {
          if (isEmptyObject(state.connectedWalletsByChainType[chainType])) {
            return state
          }
          const { [chainType]: _, ...recentConnectorIds } = state.recentConnectorIds

          return {
            connectedWalletsByChainType: {
              ...state.connectedWalletsByChainType,
              [chainType]: {}
            },
            recentConnectorIds
          }
        })
    }),
    {
      name: 'squid.wallet.store',
      version: 0,
      partialize({ recentConnectorIds }) {
        return {
          recentConnectorIds
        }
      }
    }
  )
)
