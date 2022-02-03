import { InjectedConnector } from '@web3-react/injected-connector'
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'

const POLLING_INTERVAL = 12000

export const MetaMask = new InjectedConnector({ supportedChainIds : [137]})

// export const walletconnect = new WalletConnectConnector({
//   rpc: { 1: process.env.RPC_URL_4 },
//   qrcode: true,
//   bridge: "https://bridge.walletconnect.org",
//   pollingInterval: POLLING_INTERVAL
// })


//velas mainnet

export const walletconnect = new WalletConnectConnector({
  rpc: {
      106: "https://api.velas.com",
  },
  chainId : 106 ,
  qrcode: true,
});
// walletconnect.networkId = 56;