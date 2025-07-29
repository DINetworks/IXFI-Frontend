// Xion has a way to create smart contract accounts (with social logins) these are 63 characters long
// And the particularity is that we can't derive the osmosis fallback address from these because they don't have a way to access funds in other networks
export const isXionSmartContractAddress = address => {
  return address?.length === 63
}
