import { ChainType } from '@0xsquid/squid-types'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import BigNumber from 'bignumber.js'
import { useCallback } from 'react'
import { getClient } from '../../core/client'
import { nativeXrplTokenAddress } from '../../core/constants'
import { getPrefixKey, keys, QueryKeys } from '../../core/queries/queries-keys'
import { XrplTxStatus } from '../../core/types/xrpl'
import { formatBNToReadable } from '../../services'
import { buildXrplTrustSetTx, getXrplNetwork, isXrplAddressValid } from '../../services/internal/xrplService'
import { useSigner } from '../wallet/useSigner'

/**
 * Maximum IOU amount on XRPL
 * @see https://xrpl.org/docs/references/protocol/data-types/currency-formats#comparison
 */
const MAX_IOU_AMOUNT = '9999999999999999e80'
const DEFAULT_REFETCH_INTERVAL = 20_000

export function useXrplTrustLine({ address, chain, token, amount }) {
  const { xrplSigner } = useSigner({ chain })
  const queryClient = useQueryClient()

  /**
   * Retrieves the destination account's trust line data for the given token
   */
  const trustLineQuery = useQuery({
    queryKey: keys().xrplTrustLine(token?.address, chain?.chainId, address),
    queryFn: async () => {
      if (chain?.chainType !== ChainType.XRPL || token?.type !== ChainType.XRPL) {
        return null
      }

      if (!address || !isXrplAddressValid(address)) {
        return null
      }

      const [currency, issuer] = token.address.split('.')
      if (!currency || !issuer) {
        return null
      }

      const xrplClient = await getClient(chain)
      const trustLine = await xrplClient.getTrustLine(address, issuer, currency)

      return trustLine
    },
    enabled: !!address && chain?.chainType === ChainType.XRPL && token?.type === ChainType.XRPL,
    refetchInterval: DEFAULT_REFETCH_INTERVAL
  })

  /**
   * Creates a trust line where the destination account authorizes to receive the given token
   */
  const createTrustLine = useMutation({
    mutationFn: async () => {
      try {
        if (!xrplSigner) {
          throw new Error('XRPL signer not found')
        }

        if (chain?.chainType !== ChainType.XRPL || token?.type !== ChainType.XRPL) {
          throw new Error('Chain and token to approve must be an XRPL token')
        }

        if (!address) {
          throw new Error('Destination address is required')
        }

        const network = getXrplNetwork(chain.chainId)
        if (network == null) {
          throw new Error(`XRPL network not found for chain ${chain.chainId}`)
        }

        const txRes = await xrplSigner.signAndSubmit({
          network,
          tx: buildXrplTrustSetTx({
            amount: MAX_IOU_AMOUNT,
            token: token,
            sourceAddress: address
          })
        })

        if (txRes.status !== XrplTxStatus.SUCCESS) {
          throw new Error(`Transaction failed with status: ${txRes.status}`)
        }

        const xrplClient = await getClient(chain)
        const txStatus = await xrplClient.waitForTransaction(txRes.hash, {
          interval: 1_000
        })

        if (txStatus !== XrplTxStatus.SUCCESS) {
          throw new Error(`Transaction failed with status: ${txStatus}`)
        }

        return true
      } catch (error) {
        console.error('Error creating trust line:', error)
        return false
      }
    },
    async onSuccess() {
      queryClient.invalidateQueries(getPrefixKey(QueryKeys.XrplTrustLine))
    }
  })

  /**
   * Checks if the destination account has created a trust line to receive the given token.
   */
  const isTrustLineApproved = useQuery({
    queryKey: keys().isXrplTrustLineApproved(
      address,
      token?.chainId,
      token?.type,
      token?.address,
      trustLineQuery.data?.limit,
      amount
    ),
    queryFn: async () => {
      if (token?.type !== ChainType.XRPL) {
        return true
      }

      // The native XRP token doesn't need a trust line
      if (token.address.toLowerCase() === nativeXrplTokenAddress.toLowerCase()) {
        return true
      }

      if (!amount) {
        throw new Error('Amount is required')
      }

      const limitBn = BigNumber(trustLineQuery.data?.limit || '0')
      const balanceBn = BigNumber(trustLineQuery.data?.balance || '0')
      const availableAllowanceBn = limitBn.minus(balanceBn)
      const amountBn = BigNumber(formatBNToReadable(amount, token.decimals))

      return availableAllowanceBn.gte(amountBn)
    },
    enabled: !!address && !!amount && trustLineQuery?.isSuccess && token?.type === ChainType.XRPL
  })

  /**
   * Checks if the destination account is activated (holds at least the minimum XRP reserve balance)
   * XRPL accounts need to have a minimum balance before they can receive payments
   */
  const accountActivatedInfo = useQuery({
    queryKey: keys().xrplAccountActivatedInfo(address, chain?.chainId, chain?.chainType),
    queryFn: async () => {
      if (chain?.chainType !== ChainType.XRPL || token?.type !== ChainType.XRPL) {
        return null
      }

      if (!address) {
        throw new Error('Destination address is required')
      }

      const xrplClient = await getClient(chain)

      return xrplClient.accountActivatedInfo(address)
    },
    enabled: !!address && chain?.chainType === ChainType.XRPL,
    refetchInterval: DEFAULT_REFETCH_INTERVAL,
    refetchOnWindowFocus: true
  })

  /**
   * In QR-based wallets, cleans up listeners and network requests (e.g. websockets)
   * Useful to save resources i.e when the user dismisses the QR code or aborts the connection process
   */
  const cancelCreateTrustLine = useCallback(() => {
    return xrplSigner?.cancelSignAndSubmit?.()
  }, [xrplSigner])

  return {
    createTrustLine,
    trustLineQuery,
    isTrustLineApproved,
    accountActivatedInfo,
    cancelCreateTrustLine
  }
}
