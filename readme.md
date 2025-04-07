<div align="center">
    <a href="https://ixfi.network.com">
        <img alt="logo" src="https://github.com/IXFILabs/IXFILabs/blob/main/IXFI-banner.png" style="width: 100%;">
    </a>
</div>

## IXFI Protocol

The Interoperable XFI (IXFI) Protocol introduces a groundbreaking approach to cross-chain interoperability by leveraging XFI as the primary gas token. This enables gasless cross-chain swaps through a meta-transaction relay system while enhancing XFI’s utility across multiple blockchain networks.

By addressing the limitations of CrossFi’s existing bridge, IXFI transforms CrossFi’s ecosystem into a fully interoperable and programmable cross-chain infrastructure. This innovation allows seamless asset transfers, smart contract execution, and data messaging across diverse blockchain ecosystems.

## Tech Stack

    - Node.js (v20.14)
    - React (v18.2) / Next.js (v13.3)
    - Mui (v5.12.x)
    - wagmi (2.14) + viem (v2.23)

## Development & Test on Local Environment

Clone and install npm modules

```sh
git clone https://github.com/IXFILabs/IXFI-Frontend.git
cd IXFI-Frontend
npm install
```

Create .env file and setup env variables

```
NEXT_PUBLIC_JSON_RPC=https://rpc.testnet.ms

NEXT_PUBLIC_ALCHEMY_API_KEY=<YOUR_ALCHEMY_API_KEY>

NEXT_PUBLIC_RELAYER_HOST=<RELAYER_SERVER_HOST> // refer https://github.com/IXFILabs/IXFI-Relayer.git

NEXT_PUBLIC_GATEWAY_ADDRESS=https://github.com/IXFILabs/IXFI-Frontend.git // this is gateway contract address deployed on crossfi testnet
```

Run on local environment

```sh
npm run dev
```

## Features on Websites

### Gasless Transfer Page is only available at the moment

- First connect wallet and deposit XFI or IXFI
- Approve tokens to interact via meta transactions
- Transfer or Batch Transfer tokens to other accounts

### Swap, Lending, and Network Governance features are currently unavailable. They are planned for future development as outlined in the roadmap.
