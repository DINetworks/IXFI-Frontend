import { useEffect, useState } from 'react'
import { useWriteContract } from 'wagmi'
import { showToast } from 'src/components/utils/toast'

import TokenSelector from 'src/components/wallet/token-selector'
import { erc20Abi } from 'viem'
import { MAX_UINT256, GATEWAY_CROSSFI } from 'src/configs/constant'
import BaseDialog from 'src/components/wallet/base/base-dialog'
import DialogButton from 'src/components/wallet/base/dialog-button'

const ApproveSelector = ({ openModal, setOpenModal, tokenData, approvedTokens, setReconfigApprove }) => {
  const { writeContract, isPending, isSuccess, isError, error } = useWriteContract()
  const [activeIndex, setActiveIndex] = useState()

  const closeDialog = () => {
    setOpenModal(false)
  }

  const _tokenData = tokenData.filter(
    _token => !approvedTokens.some(approvedToken => approvedToken.address === _token.address)
  )

  const applyApproveToken = () => {
    const tokenAddress = _tokenData[activeIndex].address

    writeContract({
      address: tokenAddress,
      abi: erc20Abi,
      functionName: 'approve',
      args: [GATEWAY_CROSSFI, MAX_UINT256]
    })
  }

  useEffect(() => {
    setActiveIndex(-1)
  }, [openModal])

  useEffect(() => {
    if (isSuccess) {
      setReconfigApprove(Math.random())
      closeDialog()
      showToast('success', `$${_tokenData[activeIndex].symbol} successfully approved`)
    }
    if (isError) {
      closeDialog()
      console.log(error)
    }
  }, [isSuccess, isError, error])

  return (
    <BaseDialog openModal={openModal} setOpenModal={setOpenModal} title='Select Tokens to Approve'>
      <TokenSelector tokenData={_tokenData} activeIndex={activeIndex} setActiveIndex={setActiveIndex} />

      <DialogButton isPending={isPending} text='Apply' onClick={applyApproveToken} />
    </BaseDialog>
  )
}

export default ApproveSelector
