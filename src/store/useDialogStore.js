import { create } from 'zustand'

export const useDialogStore = create(_ => ({
  openConnectDialog: false,
  openChainDialog: false,
  openApproveDialog: false,
  openDisapproveDialog: false,
  openDepositDialog: false,
  openWithdrawDialog: false
}))
