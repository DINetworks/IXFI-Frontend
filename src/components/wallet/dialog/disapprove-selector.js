import { useEffect, useState } from 'react'
import { useWriteContract } from 'wagmi'
import { erc20Abi } from 'viem'

import { showToast } from 'src/components/utils/toast'
import TokenSelector from 'src/components/wallet/token-selector'

import { GATEWAY_CROSSFI } from 'src/configs/constant'
import BaseDialog from 'src/components/wallet/base/base-dialog'
import DialogButton from 'src/components/wallet/base/dialog-button'

const DisapproveSelector = ({ openModal, setOpenModal, approvedTokens, setReconfigApprove }) => {
  const { writeContract, isPending, data, isSuccess, isError, error } = useWriteContract()
  const [activeIndex, setActiveIndex] = useState()

  const closeDialog = () => {
    setOpenModal(false)
  }

  const applyDisapproveTokens = () => {
    const tokenAddress = approvedTokens[activeIndex].address

    writeContract({
      address: tokenAddress,
      abi: erc20Abi,
      functionName: 'approve',
      args: [GATEWAY_CROSSFI, BigInt('0')]
    })
  }

  useEffect(() => {
    setActiveIndex(-1)
  }, [openModal])

  useEffect(() => {
    if (isSuccess && data) {
      setReconfigApprove(Math.random())
      closeDialog()
      showToast('success', `$${approvedTokens[activeIndex].symbol} successfully disapproved`)
    }
    if (isError) {
      closeDialog()
      showToast('error', `error happend`)
      console.log(error)
    }
  }, [isSuccess, isError, error])

  return (
    <BaseDialog openModal={openModal} setOpenModal={setOpenModal} title='Select Tokens to Disapprove'>
      <TokenSelector tokenData={approvedTokens} activeIndex={activeIndex} setActiveIndex={setActiveIndex} />

      <DialogButton isPending={isPending} text='Apply' onClick={applyDisapproveTokens} />
    </BaseDialog>
  )
}

export default DisapproveSelector
