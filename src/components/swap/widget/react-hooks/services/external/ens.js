import { CloudflareProvider } from 'ethers'
import { internalSquidApiBaseUrl } from '../../core/constants'

const provider = new CloudflareProvider()
const API_BASE_URL = `${internalSquidApiBaseUrl}/ens`

const getAvatarFromEns = async ensName => {
  if (!ensName) return
  try {
    const resolver = await provider.getResolver(ensName)
    return await resolver?.getText('avatar')
  } catch (error) {}
}

const getEnsDataFromAddress = async address => {
  if (!address) return {}
  try {
    const ensName = await provider.lookupAddress(address)
    if (!ensName) return {}
    const avatar = await getAvatarFromEns(ensName)
    return { name: ensName, avatar }
  } catch (error) {
    return {}
  }
}

export class EnsService {
  static async getEnsDataFromAddress(address) {
    if (!address) return {}
    try {
      const ensData = await getEnsDataFromAddress(address)
      return ensData
    } catch (error) {
      console.error('Error fetching ENS data:', error)
      return {}
    }
  }
  static async searchEnsNames(partialName) {
    if (!partialName) return []
    try {
      const response = await fetch(`${API_BASE_URL}?action=searchEnsNames&query=${encodeURIComponent(partialName)}`)
      return await response.json()
    } catch (error) {
      console.error('Error searching ENS names:', error)
      return []
    }
  }
  static async getExactEns(exactEns) {
    if (!exactEns) return []
    try {
      const response = await fetch(`${API_BASE_URL}?action=getExactEns&query=${encodeURIComponent(exactEns)}`)
      return await response.json()
    } catch (error) {
      console.error('Error fetching exact ENS:', error)
      return []
    }
  }
}
