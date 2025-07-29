import { ChainType } from '@0xsquid/squid-types'
import {
  createAssociatedTokenAccountInstruction,
  createTransferInstruction,
  getAssociatedTokenAddress
} from '@solana/spl-token'
import { StandardWalletAdapter } from '@solana/wallet-standard-wallet-adapter-base'
import { PublicKey, SystemProgram, Transaction, VersionedTransaction } from '@solana/web3.js'
import { nativeSolanaTokenAddress } from '../../core/constants'
import { isStandardWalletWithCustomFeatures, standardWalletOverrides } from './walletStandardService'

const SOLANA_FEATURES = ['solana:signTransaction']

/**
 * Validates that a given standard wallet has all the required features for a Solana wallet
 */
function isSolanaStandardWallet(wallet) {
  return isStandardWalletWithCustomFeatures(wallet, SOLANA_FEATURES)
}

export function filterSolanaWallets(standardWallets) {
  // Filter out all non-Solana standard wallets
  return standardWallets.filter(isSolanaStandardWallet).map(formatSolanaWallet)
}

/**
 * Format a Solana standard wallet into a Squid Wallet
 */
function formatSolanaWallet(wallet) {
  const { icon, name: defaultName, id } = wallet
  const standardWalletId = id || defaultName
  const walletOverrides = standardWalletOverrides[standardWalletId]
  const walletIcon = walletOverrides?.icon || icon
  const name = walletOverrides?.name || defaultName
  const connectorId = walletOverrides?.connectorId || standardWalletId
  return {
    connectorId,
    name,
    connectorName: name,
    type: ChainType.SOLANA,
    icon: walletIcon,
    windowFlag: name,
    isMobile: false,
    isInstalled() {
      return true
    },
    connector: new StandardWalletAdapter({ wallet })
  }
}

export const isSolanaAddressValid = address => {
  try {
    new PublicKey(address)
    return true
  } catch {
    return false
  }
}

/**
 * Execute a Solana swap transaction
 * This will be used for the swap flow - Using Jupiter Dex under the hood
 */
export const executeSolanaSwap = async ({ route, signer, connection, onSigned }) => {
  if (!route?.transactionRequest?.data) {
    throw new Error('Invalid parameters')
  }
  const swapRequest = route.transactionRequest.data
  const swapTransactionBuf = Buffer.from(swapRequest, 'base64')
  // TODO: fix types
  // const transaction = VersionedTransaction.deserialize(
  //   Uint8Array.from(swapTransactionBuf)
  // );
  const transaction = VersionedTransaction.deserialize(swapTransactionBuf)
  try {
    const latestBlockhash = await connection.getLatestBlockhash()
    const signature = await signer.sendTransaction(transaction, connection)
    onSigned?.(signature)
    await connection.confirmTransaction({
      signature,
      blockhash: latestBlockhash.blockhash,
      lastValidBlockHeight: latestBlockhash.lastValidBlockHeight
    })
    return signature
  } catch (error) {
    console.error('Solana swap failed:', error)
    throw error
  }
}

/**
 * Execute a Solana transfer transaction for both native SOL and SPL tokens
 * @param amount - Amount to transfer in raw units (lamports for SOL, raw token units for SPL)
 * @param target - Target wallet address
 * @param signer - Solana wallet adapter instance
 * @param connection - Solana RPC connection
 * @param sourceToken - Token information (undefined for native SOL)
 * @param onSigned - Optional callback triggered when transaction is signed
 * @returns Transaction signature
 */
export const executeSolanaTransfer = async ({ amount, target, signer, connection, sourceToken, onSigned }) => {
  // Validate signer and target address
  if (!signer.publicKey) {
    throw new Error('Signer public key not found')
  }

  if (!isSolanaAddressValid(target)) {
    throw new Error('Invalid target address')
  }

  const targetPubKey = new PublicKey(target)
  const transaction = new Transaction()
  const isNativeToken = !sourceToken || sourceToken.address.toLowerCase() === nativeSolanaTokenAddress.toLowerCase()

  if (isNativeToken) {
    // Handle native SOL transfer
    transaction.add(
      SystemProgram.transfer({
        fromPubkey: signer.publicKey,
        toPubkey: targetPubKey,
        lamports: amount
      })
    )
  } else {
    // Handle SPL token transfer
    const mint = new PublicKey(sourceToken.address)
    // Get Associated Token Accounts (ATAs) for both source and target
    const sourceATA = await getAssociatedTokenAddress(mint, signer.publicKey, true)
    const targetATA = await getAssociatedTokenAddress(mint, targetPubKey, true)
    // Check if target ATA exists and create if needed
    const targetAccount = await connection.getAccountInfo(targetATA)
    if (!targetAccount) {
      transaction.add(createAssociatedTokenAccountInstruction(signer.publicKey, targetATA, targetPubKey, mint))
    }
    // Add the token transfer instruction
    transaction.add(createTransferInstruction(sourceATA, targetATA, signer.publicKey, amount))
  }

  // Get latest blockhash and sign transaction
  const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash()
  transaction.recentBlockhash = blockhash
  transaction.feePayer = signer.publicKey
  const signature = await signer.sendTransaction(transaction, connection)

  // Trigger callback for UI purposes (show loading state)
  onSigned?.(signature)

  // Wait for transaction confirmation
  await connection.confirmTransaction({
    signature,
    blockhash,
    lastValidBlockHeight
  })

  return signature
}
