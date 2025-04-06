import { useEffect, useState } from 'react'
import { Box, Typography, CircularProgress } from '@mui/material'
import { useWriteContract } from 'wagmi'
import { showToast } from '../utils/toast'
import TokenSelector from './token-selector'
import erc20Abi from 'src/contracts/erc20.json'
import { GATEWAY_CROSSFI } from 'src/configs/constant'
import BaseDialog from './base-dialog'
import DialogButton from './dialog-button'

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
