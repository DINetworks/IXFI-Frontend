export class TokensChains {
    constructor() {
        this.tokens = [];
        this.chains = [];
    }

    getTokenData(address, chainId) {
        const token = this.tokens.find(e => 
            e.address.toLowerCase() === address?.toLowerCase() && 
            e.chainId == chainId
        );
        
        if (!token) {
            throw new Error(`Could not find token with address ${address} on chain ${chainId}`);
        }
        return token;
    }

    getChainData(chainId) {
        const chain = this.chains.find(chain => chain.chainId == chainId);
        if (!chain) {
            throw new Error(`Could not find chain with id ${chainId}`);
        }
        return chain;
    }
}