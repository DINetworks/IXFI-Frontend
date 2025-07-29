import { createWithEqualityFn } from 'zustand/traditional'
import { shallow } from 'zustand/shallow'

export const useEarnPoolsStore = createWithEqualityFn(
  set => ({
    tag: '',
    chainId: 1,
    protocol: 'all',
    interval: '24h',
    query: '',
    page: 1,
    sortBy: '',
    orderBy: '',
    poolsData: {
      pagination: { totalItems: 0 },
      pools: []
    },
    liquidityModal: null,
    liquidityZap: {
      revertPrice: false,
      tickLower: null,
      tickUpper: null,
      tokensForZap: [],
      zapInfo: null,
      zapApiError: null,
      zapOutToken: null,
      zapOutPercent: 100
    },
    tokenSelectDialog: {
      open: false,
      mode: 'ADD',
      selectedToken: {}
    },
    deadline: 0,
    zapPreviewDialog: false,
    zapOutPreviewDialog: false,
    collectFeePosition: null,
    set: fn => set(fn, true)
  }),
  shallow
)
