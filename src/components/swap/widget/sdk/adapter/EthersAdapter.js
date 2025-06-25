import { ethers } from "ethers";

export class EthersAdapter {
    rpcProvider(rpc) {
        return new ethers.JsonRpcProvider(rpc);
    }

    contract(address, abi, provider) {
        // type hack to support ethers v5
        return new ethers.Contract(address, abi, provider);
    }

    interface(abi) {
        return new ethers.Interface(abi);
    }

    serializeTransaction(tx) {
        return ethers.Transaction.from(tx).unsignedSerialized;
    }
}