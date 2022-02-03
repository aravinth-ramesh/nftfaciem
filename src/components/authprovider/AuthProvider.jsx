import React, { createContext, useState, useEffect } from "react";
import { useWeb3React } from "@web3-react/core";
import { MetaMask, walletconnect } from "./connectors";
import { useEagerConnect, useInactiveListener } from "./web3Hooks";
import {
  NoEthereumProviderError,
  UserRejectedRequestError as UserRejectedRequestErrorInjected,
} from "@web3-react/injected-connector";
import { UserRejectedRequestError as UserRejectedRequestErrorWalletConnect } from "@web3-react/walletconnect-connector";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";
import { UserRejectedRequestError as UserRejectedRequestErrorFrame } from "@web3-react/frame-connector";
import { UnsupportedChainIdError } from "@web3-react/core";
import {
  getErrorNotificationMessage,
  getSuccessNotificationMessage,
} from "../helper/ToastNotification";
import { createNotification } from "react-redux-notify";
import { useDispatch, useSelector } from "react-redux";
import { InjectedConnector } from "@web3-react/injected-connector";
import Web3 from "web3";
import configuration from "react-global-configuration";
import { formatEther } from "@ethersproject/units";

export const authContext = createContext({});

const AuthProvider = ({ children }, props) => {
  const context = useWeb3React();
  const dispatch = useDispatch();
  const {
    connector,
    library,
    chainId,
    account,
    activate,
    deactivate,
    active,
    error,
  } = context;

  const { ethereum } = window;

  const netID = 137;

  const chainIdHex = "0x89";

  const rpcUrl = "https://rpc-mainnet.matic.network";

  const chainName = "Polygon - Mainnet";


  const nativeCurrencyName = "Polygon";

  const nativeCurrencySymbol = "Matic";


  const nativeCurrencyDecimals = 18;

  const blockExplorerUrl = "https://polygonscan.com/";

  const [activatingConnector, setActivatingConnector] = useState();

  const [auth, setAuth] = useState({
    loading: true,
    accounts: "",
    connectWalletStatus: false,
    ethBalance: null,
    tokenBalance: null,
    tokenData: null,
    logoutStatus: localStorage.getItem("inital_connect"),
    token: null,
  });

  // const loginData = useSelector((state) => state.users.loginInputData);

  const supportedChains = [
    {
      chainId: [netID],
      name: nativeCurrencyName,
      symbol: nativeCurrencySymbol,
      isTestNet: false,
    },
  ];

  const loginConnectors = [
    {
      name: "MetaMask",
      logo: "/assets/images/metamask-fox.svg",
      is_popular: true,
      connectorFunction: MetaMask,
    },
    // {
    //   name: "WalletConnect",
    //   logo: "/assets/images/wallet-connect.png",
    //   is_popular: false,
    //   connectorFunction: walletconnect,
    // },
  ];

  useEffect(() => {
    if (activatingConnector && activatingConnector === connector && !auth.loading) {
      setActivatingConnector(undefined);
    }
  }, [activatingConnector, connector, auth.loading]);

  const handleConnector = (connector) => {
    const network =
      ethereum && ethereum.networkVersion ? ethereum.networkVersion : "";
    console.log(netID, network, connector);

    setAuth({
      ...auth,
      loading: true,
      connectWalletStatus: true,
    });

    setActivatingConnector(connector);
    if (connector instanceof WalletConnectConnector) {
      connector.walletConnectProvider = undefined;
    }

    if (connector instanceof InjectedConnector) {
      if (netID == network) {
        console.log("same network");
        activate(connector);
      } else {
        console.log("change network");
        changeNetwork();
      }
    } else {
      activate(connector);
    }
  };

  // handle logic to eagerly connect to the injected ethereum provider, if it exists and has granted access already
  const triedEager = useEagerConnect(auth.logoutStatus);

  const changeNetwork = async () => {
    // MetaMask injects the global API into window.ethereum
    if (ethereum) {
      try {
        // check if the chain to connect to is installed

        await window.ethereum
          .request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: chainIdHex }], // chainId must be in hexadecimal numbers
          })
          .then(() => {
            activate(MetaMask);
          })
          .catch((e) => {
            if (e.code === 4902) {
              addNetwork();
            }
            else {
              setActivatingConnector(undefined);
              const notificationMessage = getErrorNotificationMessage(e.message);
              dispatch(createNotification(notificationMessage));
            }
          });
        //await ethereum.enable();
      } catch (error) {
        // This error code indicates that the chain has not been added to MetaMask
        // if it is not, then install it into the user MetaMask
        if (error.code === 4902) {
          addNetwork();
        }
      }
    } else {
      // if no window.ethereum then MetaMask is not installed
    }
  };

  const addNetwork = async () => {
    try {
      await window.ethereum
        .request({
          method: "wallet_addEthereumChain",
          params: [
            {
              //https://data-seed-prebsc-1-s1.binance.org:8545/
              chainId: chainIdHex,
              rpcUrls: [rpcUrl],
              chainName: chainName,
              nativeCurrency: {
                name: nativeCurrencyName,
                symbol: nativeCurrencySymbol, // 2-6 characters long
                decimals: nativeCurrencyDecimals,
              },
              blockExplorerUrls: [
                blockExplorerUrl,
              ],
            },
          ],
        })
        .then(() => {
          activate(MetaMask);
        })
        .catch((e) => {
          setActivatingConnector(undefined);
          const notificationMessage = getErrorNotificationMessage(
            e.message
          );
          dispatch(createNotification(notificationMessage));
        });
      // await ethereum.enable();
    } catch (addError) {
      const notificationMessage = getErrorNotificationMessage(addError);
      dispatch(createNotification(notificationMessage));
    }
  }

  // handle logic to connect in reaction to certain events on the injected ethereum provider, if it exists
  useInactiveListener(!triedEager || !activatingConnector);

  function getErrorMessage(error) {

    setAuth({
      ...auth,
      loading: false,
      connectWalletStatus: false,
    });

    if (error instanceof NoEthereumProviderError) {
      const notificationMessage = getErrorNotificationMessage(
        "No Ethereum browser extension detected, install MetaMask on desktop or visit from a dApp browser on mobile."
      );
      dispatch(createNotification(notificationMessage));
    } else if (error instanceof UnsupportedChainIdError) {
      // const notificationMessage = getErrorNotificationMessage(
      //   "You're connected to an unsupported network."
      // );
      // dispatch(createNotification(notificationMessage));
    } else if (
      error instanceof UserRejectedRequestErrorInjected ||
      error instanceof UserRejectedRequestErrorWalletConnect ||
      error instanceof UserRejectedRequestErrorFrame
    ) {
      const notificationMessage = getErrorNotificationMessage(
        "User rejected the request"
      );
      dispatch(createNotification(notificationMessage));
    } else {
      const notificationMessage = getErrorNotificationMessage(
        "An unknown error occurred. Check the console for more details"
      );
      dispatch(createNotification(notificationMessage));
    }
  }

  useEffect(() => {
    if (!!error) {
      getErrorMessage(error);
    }
  }, [error]);

  useEffect(() => {
    if (
      netID !== chainId &&
      chainId &&
      connector instanceof InjectedConnector
    ) {
      deactivate();
    } else if (connector instanceof InjectedConnector) {
      activate(MetaMask);
    }
  }, [chainId]);

  const hanldeLogout = () => {
    setAuth({
      ...auth,
      loading: false,
      accounts: "",
      connectWalletStatus: false,
      ethBalance: null,
      authStatus: false,
      chainStatus: false,
      tokenBalance: null,
      tokenData: null,
      logoutStatus: "false",
      token: null,
    });
    setActivatingConnector(undefined);
    localStorage.removeItem("wallet_address");
    localStorage.setItem("inital_connect", false);
    deactivate();
  };

  const saveAccountDetails = async () => {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    }

    const { ethereum } = window;

    try {
      const web3 = window.web3;
      if (account.length > 0) {
        ;

        localStorage.setItem("inital_connect", true);
        // const ethBalance = await web3.eth.getBalance(account);
        // console.log(ethBalance)
        // const ethBalanceFormated = await web3.utils
        //   .fromWei(ethBalance, "Ether")
        //   .substring(0, 8);
        //   console.log(newbalance)
        // const networkId = await web3.eth.net.getId();
        // console.log(networkId)
        // console.log(ethBalanceFormated)
        // const tokenData = Token.networks[networkId];
        // let tokens = null;
        // let token = null;
        // if (tokenData) {
        //   token = new web3.eth.Contract(Token.abi, tokenData.address);
        //   let tokenBalance = await token.methods.balanceOf(account).call();
        //   tokens = window.web3.utils
        //     .fromWei(tokenBalance.toString(), "Ether")
        //     .substring(0, 5);
        // } else {
        //   window.alert("Token contract not deployed to detected network.");
        // }
        await library
          .getBalance(account)
          .then((balance) => {
            if (balance) {
              setAuth({
                ...auth,
                accounts: account,
                // tokenData: token,
                // tokenBalance: tokens,
                chainStatus: false,
                connectWalletStatus: false,
                ethBalance: formatEther(balance),
                logoutStatus: localStorage.getItem("inital_connect"),
                authStatus: true,
              });
            }
          })
          .catch((e) => {
            console.log(e);
            setAuth({
              ...auth,
              ethBalance: null,
            });
          });

      } else {
        hanldeLogout();
        const notificationMessage = getSuccessNotificationMessage(
          "Signed out successfully"
        );
        dispatch(createNotification(notificationMessage));
      }
    } catch (error) {
      setAuth({ ...auth, connectWalletStatus: false, authStatus: false });
    }
  };


  const getProviderSinger = (message_content) => {
    library.getSigner(account)
      .signMessage(message_content)
      .then((signature) => console.log(signature))
      .catch((error) => {
        const notificationMessage = getErrorNotificationMessage(
          error
        );
        dispatch(createNotification(notificationMessage));
      })
  }

  useEffect(() => {
    if (account) {
      saveAccountDetails();
    } else {
      hanldeLogout();
    }
  }, [account]);

  // useEffect(() => {
  //   const onbeforeunloadFn = () => {
  //     localStorage.removeItem("accessToken");
  //     localStorage.removeItem("userId");
  //     localStorage.removeItem("userLoginStatus");
  //     localStorage.removeItem("user_picture");
  //     localStorage.removeItem("username");
  //     localStorage.removeItem("wallet_address");
  //   };

  //   window.addEventListener("beforeunload", onbeforeunloadFn);
  //   return () => {
  //     window.removeEventListener("beforeunload", onbeforeunloadFn);
  //   };
  // }, []);

  return (
    <authContext.Provider
      value={{
        auth,
        context,
        handleConnector,
        loginConnectors,
        activatingConnector,
        hanldeLogout,
        supportedChains,
        getProviderSinger
      }}
    >
      {children}
    </authContext.Provider>
  );
};

export default AuthProvider;
