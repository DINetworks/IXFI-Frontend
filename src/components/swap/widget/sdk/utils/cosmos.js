import { ChainType } from '@0xsquid/squid-types';

export function getCosmosChainsForChainIds({ chainIds, chains }) {
    return chains.filter(c => 
        c.chainType === ChainType.COSMOS &&
        // if chainIds is not provided, return all cosmos chains
        (chainIds.length === 0
            ? true
            // else return only chains that are in chainIds
            : chainIds?.includes(c.chainId))
    );
}