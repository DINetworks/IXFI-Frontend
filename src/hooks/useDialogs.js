import { useDialogStore } from 'src/store/useDialogStore'

export const useDialogs = () => {
  const setConnectDialog = openConnectDialog => {
    useDialogStore.setState({ openConnectDialog })
  }

  const setChainDaialog = openChainDialog => {
    useDialogStore.setState({ openChainDialog })
  }

  const setApproveDialog = openApproveDialog => {
    useDialogStore.setState({ openApproveDialog })
  }

  const setDisapproveDialog = openDisapproveDialog => {
    useDialogStore.setState({ openDisapproveDialog })
  }

  const setDepositWithdrawDialog = (open, isDeposit) => {
    if (isDeposit) useDialogStore.setState({ openDepositDialog: open })
    else {
      useDialogStore.setState({ openWithdrawDialog: open })
    }
  }

  const dialogsState = useDialogStore(state => state)

  return {
    setConnectDialog,
    setChainDaialog,
    setApproveDialog,
    setDisapproveDialog,
    setDepositWithdrawDialog,
    ...dialogsState
  }
}
