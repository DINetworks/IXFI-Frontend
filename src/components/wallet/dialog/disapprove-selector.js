import { useEffect, useState } from 'react'
import { useAccount, useWriteContract } from 'wagmi'
import { erc20Abi } from 'viem'

import { showToast } from 'src/components/utils/toast'
import TokenSelector from 'src/components/wallet/token-selector'

import { GATEWAY_CROSSFI } from 'src/configs/constant'
import BaseDialog from 'src/components/wallet/base/base-dialog'
import DialogButton from 'src/components/wallet/base/dialog-button'
import { waitForTransactionReceipt } from 'src/wallet/utils'

const DisapproveSelector = ({ openModal, setOpenModal, approvedTokens, setReconfigApprove }) => {
  const { writeContract, data, isSuccess, isError, error } = useWriteContract()
  const [activeIndex, setActiveIndex] = useState()
  const [isPending, setPending] = useState(false)
  const { chain } = useAccount()

  const closeDialog = () => {
    setActiveIndex(-1)
    setOpenModal(false)
  }

  const applyDisapproveTokens = () => {
    const tokenAddress = approvedTokens[activeIndex].address

    setPending(true)
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
    if (isError) {
      showToast('error', `error happend`)
      setPending(false)
      closeDialog()
      console.log(error)
    }
  }, [isError, error])

  useEffect(() => {
    const showSuccessResult = async () => {
      const receipt = await waitForTransactionReceipt(chain, data)

      const event = receipt.logs.find(log => {
        return log.address.toLowerCase() === approvedTokens[activeIndex].address.toLowerCase()
      })

      if (event) {
        showToast('success', `$${approvedTokens[activeIndex].symbol} successfully disapproved`)
        closeDialog()
        setReconfigApprove(Math.random())
      }
    }

    if (isSuccess) {
      setPending(false)
      showSuccessResult()
    }
  }, [isSuccess, data])

  return (
    <BaseDialog openModal={openModal} setOpenModal={setOpenModal} title='Select Tokens to Disapprove'>
      <TokenSelector tokenData={approvedTokens} activeIndex={activeIndex} setActiveIndex={setActiveIndex} />

      <DialogButton isPending={isPending} text='Apply' onClick={applyDisapproveTokens} />
    </BaseDialog>
  )
}

export default DisapproveSelector
