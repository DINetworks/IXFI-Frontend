import { useQuery } from '@tanstack/react-query'

const zeroAddress = '0x0000000000000000000000000000000000000000'
const avatarImagesBaseUrl = 'https://raw.githubusercontent.com/0xsquid/assets/main/squid-brand-assets/pfps'
const TOTAL_AVATARS = 60

const avatarImages = Array.from({
  length: TOTAL_AVATARS
}).map((_, i) => `${avatarImagesBaseUrl}/pfp${i + 1}.svg`)

/**
 * Simple hash function to create a deterministic index from a given string.
 * @param {string} str - The input string to hash.
 * @param {number} max - The maximum value for the hash.
 * @returns {number} - The index within the array.
 */
const hashStringToIndex = (str, max) => {
  let index = 0
  for (let i = 0; i < str.length; i++) {
    index = (index * 31 + str.charCodeAt(i)) % max
  }

  return index
}

/**
 * Custom hook to return a deterministic avatar image URL based on the provided seed.
 * @param {string} seed - The seed used to determine the avatar.
 * @returns {string} - The selected avatar image URL.
 */
export const useAvatar = (seed = zeroAddress) => {
  const { data: avatar } = useQuery({
    queryKey: ['avatar', seed],
    queryFn: () => {
      const index = hashStringToIndex(seed, avatarImages.length)
      return avatarImages[index]
    },
    // data is static, so no need to refetch
    refetchOnWindowFocus: false,
    cacheTime: Infinity,
    staleTime: Infinity
  })

  return avatar || ''
}
