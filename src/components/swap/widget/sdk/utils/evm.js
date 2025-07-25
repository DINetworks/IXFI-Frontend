export function getEvmTokensForChainIds({ chainIds, tokens }) {
    // if no chains are provided, use all chains
    const filteredChainIds = chainIds.length === 0 
        ? tokens.map(t => String(t.chainId)) 
        : chainIds;
    
    // remove invalid and duplicate chains and convert to number
    const filteredChains = new Set(filteredChainIds.map(Number).filter(c => !isNaN(c)));
    
    return tokens.filter(t => filteredChains.has(Number(t.chainId)));
}

export function getChainRpcUrls({ chains }) {
    return chains.reduce((acc, chain) => ({
        ...acc,
        [chain.chainId]: chain.rpc
    }), {});
}