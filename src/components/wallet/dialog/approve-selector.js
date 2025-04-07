import { useEffect, useState } from 'react'
import { useAccount, useWriteContract } from 'wagmi'
import { showToast } from 'src/components/utils/toast'

import TokenSelector from 'src/components/wallet/token-selector'
import { erc20Abi } from 'viem'
import { MAX_UINT256, GATEWAY_CROSSFI } from 'src/configs/constant'
import BaseDialog from 'src/components/wallet/base/base-dialog'
import DialogButton from 'src/components/wallet/base/dialog-button'
import { waitForTransactionReceipt } from 'src/wallet/utils'

const ApproveSelector = ({ openModal, setOpenModal, tokenData, approvedTokens, setReconfigApprove }) => {
  const { writeContract, isPending, isSuccess, isError, error, data } = useWriteContract()
  const [activeIndex, setActiveIndex] = useState()
  const { chain } = useAccount()

  const closeDialog = () => {
    setActiveIndex(-1)
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
    if (isError) {
      closeDialog()
      console.log(error)
    }
  }, [isError, error])

  useEffect(() => {
    const showSuccessResult = async () => {
      const receipt = await waitForTransactionReceipt(chain, data)

      const event = receipt.logs.find(log => {
        return log.address.toLowerCase() === _tokenData[activeIndex].address.toLowerCase()
      })

      if (event) {
        showToast('success', `$${_tokenData[activeIndex].symbol} successfully approved`)
        closeDialog()
        setReconfigApprove(Math.random())
      }
    }

    if (isSuccess) {
      showSuccessResult()
    }
  }, [isSuccess, data])

  return (
    <BaseDialog openModal={openModal} setOpenModal={setOpenModal} title='Select Tokens to Approve'>
      <TokenSelector tokenData={_tokenData} activeIndex={activeIndex} setActiveIndex={setActiveIndex} />

      <DialogButton isPending={isPending} text='Apply' onClick={applyApproveToken} />
    </BaseDialog>
  )
}

export default ApproveSelector
