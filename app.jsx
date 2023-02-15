//import Portis from "@portis/web3";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { Alert, Button, Col, List, Menu, Row, InputNumber, Card, Divider,  Radio} from "antd";
import "antd/dist/antd.css";
import Authereum from "authereum";
import {
  useBalance,
  useContractLoader,
  useContractReader,
  useGasPrice,
  useOnBlock,
  useUserProviderAndSigner,
} from "eth-hooks";
import { useExchangeEthPrice } from "eth-hooks/dapps/dex";
import { useEventListener } from "eth-hooks/events/useEventListener";
import React, { useCallback, useEffect, useState } from "react";
import { BrowserRouter, Link, Route, Switch } from "react-router-dom";
import WalletLink from "walletlink";
import Web3Modal from "web3modal";

import { Address, Account, Balance, Contract, Faucet,  Header, ThemeSwitch } from "./components";
import { INFURA_ID, NETWORK, NETWORKS, ALCHEMY_KEY } from "./constants";
import externalContracts from "./contracts/external_contracts";
// contracts
import deployedContracts from "./contracts/hardhat_contracts.json";
import { Transactor } from "./helpers";
// import Hints from "./Hints";
//import { ExampleUI, Hints, Subgraph } from "./views";
import "./App.css";
const { ethers } = require("ethers");
const humanizeDuration = require("humanize-duration");

/// 📡 What chain are your contracts deployed to?
const targetNetwork = NETWORKS.localhost; // <------- select your target frontend network (localhost, rinkeby, xdai, mainnet)

// 😬 Sorry for all the console logging
const DEBUG = true;
const NETWORKCHECK = true;

// 🛰 providers
if (DEBUG) console.log("📡 Connecting to Mainnet Ethereum");
// const mainnetProvider = getDefaultProvider("mainnet", { infura: INFURA_ID, etherscan: ETHERSCAN_KEY, quorum: 1 });
// const mainnetProvider = new InfuraProvider("mainnet",INFURA_ID);
//
// attempt to connect to our own scaffold eth rpc and if that fails fall back to infura...
// Using StaticJsonRpcProvider as the chainId won't change see https://github.com/ethers-io/ethers.js/issues/901
const scaffoldEthProvider = navigator.onLine
  ? new ethers.providers.StaticJsonRpcProvider("https://rpc.scaffoldeth.io:48544")
  : null;
const poktMainnetProvider = navigator.onLine
  ? new ethers.providers.StaticJsonRpcProvider(
      "https://eth-mainnet.g.alchemy.com/v2/pmZFj4utEW0QnKbGMIRKUAzeCnsinoRS",
    )
  : null;
const mainnetInfura = navigator.onLine
  ? new ethers.providers.StaticJsonRpcProvider(`https://eth-mainnet.alchemyapi.io/v2/${ALCHEMY_KEY}`)
  : null;
// ( ⚠️ Getting "failed to meet quorum" errors? Check your INFURA_ID
// 🏠 Your local provider is usually pointed at your local blockchain
const localProviderUrl = targetNetwork.rpcUrl;
// as you deploy to other networks you can set REACT_APP_PROVIDER=https://dai.poa.network in packages/react-app/.env
const localProviderUrlFromEnv = process.env.REACT_APP_PROVIDER ? process.env.REACT_APP_PROVIDER : localProviderUrl;
if (DEBUG) console.log("🏠 Connecting to provider:", localProviderUrlFromEnv);
const localProvider = new ethers.providers.StaticJsonRpcProvider(localProviderUrlFromEnv);

// 🔭 block explorer URL
const blockExplorer = targetNetwork.blockExplorer;

// Coinbase walletLink init
const walletLink = new WalletLink({
  appName: "coinbase",
});

// WalletLink provider
const walletLinkProvider = walletLink.makeWeb3Provider(`https://eth-mainnet.alchemyapi.io/v2/${ALCHEMY_KEY}`, 1);

// Portis ID: 6255fb2b-58c8-433b-a2c9-62098c05ddc9
/*
  Web3 modal helps us "connect" external wallets:
*/
const web3Modal = new Web3Modal({
  network: "mainnet", // Optional. If using WalletConnect on xDai, change network to "xdai" and add RPC info below for xDai chain.
  cacheProvider: true, // optional
  theme: "light", // optional. Change to "dark" for a dark theme.
  providerOptions: {
    walletconnect: {
      package: WalletConnectProvider, // required
      options: {
        bridge: "https://polygon.bridge.walletconnect.org",
        infuraId: INFURA_ID,
        rpc: {
          1: `https://eth-mainnet.alchemyapi.io/v2/${ALCHEMY_KEY}`, // mainnet // For more WalletConnect providers: https://docs.walletconnect.org/quick-start/dapps/web3-provider#required
          42: `https://kovan.infura.io/v3/${INFURA_ID}`,
          100: "https://dai.poa.network", // xDai
        },
      },
    },
    "custom-walletlink": {
      display: {
        logo: "https://play-lh.googleusercontent.com/PjoJoG27miSglVBXoXrxBSLveV6e3EeBPpNY55aiUUBM9Q1RCETKCOqdOkX2ZydqVf0",
        name: "Coinbase",
        description: "Connect to Coinbase Wallet (not Coinbase App)",
      },
      package: walletLinkProvider,
      connector: async (provider, _options) => {
        await provider.enable();
        return provider;
      },
    },
    authereum: {
      package: Authereum, // required
    },
  },
});

function App(props) {
  const mainnetProvider =
    poktMainnetProvider && poktMainnetProvider._isProvider
      ? poktMainnetProvider
      : scaffoldEthProvider && scaffoldEthProvider._network
      ? scaffoldEthProvider
      : mainnetInfura;

  const [injectedProvider, setInjectedProvider] = useState();
  const [address, setAddress] = useState();

  const logoutOfWeb3Modal = async () => {
    await web3Modal.clearCachedProvider();
    if (injectedProvider && injectedProvider.provider && typeof injectedProvider.provider.disconnect == "function") {
      await injectedProvider.provider.disconnect();
    }
    setTimeout(() => {
      window.location.reload();
    }, 1);
  };

  /* 💵 This hook will get the price of ETH from 🦄 Uniswap: */
  const price = useExchangeEthPrice(targetNetwork, mainnetProvider);

  /* 🔥 This hook will get the price of Gas from ⛽️ EtherGasStation */
  const gasPrice = useGasPrice(targetNetwork, "fast");
  // Use your injected provider from 🦊 Metamask or if you don't have it then instantly generate a 🔥 burner wallet.
  const userProviderAndSigner = useUserProviderAndSigner(injectedProvider, localProvider);
  const userSigner = userProviderAndSigner.signer;

  useEffect(() => {
    async function getAddress() {
      if (userSigner) {
        const newAddress = await userSigner.getAddress();
        setAddress(newAddress);
      }
    }
    getAddress();
  }, [userSigner]);

  // You can warn the user if you would like them to be on a specific network
  const localChainId = localProvider && localProvider._network && localProvider._network.chainId;
  const selectedChainId =
    userSigner && userSigner.provider && userSigner.provider._network && userSigner.provider._network.chainId;

  // For more hooks, check out 🔗eth-hooks at: https://www.npmjs.com/package/eth-hooks

  // The transactor wraps transactions and provides notificiations
  const tx = Transactor(userSigner, gasPrice);

  // Faucet Tx can be used to send funds from the faucet
  const faucetTx = Transactor(localProvider, gasPrice);

  // 🏗 scaffold-eth is full of handy hooks like this one to get your balance:
  const yourLocalBalance = useBalance(localProvider, address);

  // Just plug in different 🛰 providers to get your balance on different chains:
  const yourMainnetBalance = useBalance(mainnetProvider, address);

  // const contractConfig = useContractConfig();

  const contractConfig = { deployedContracts: deployedContracts || {}, externalContracts: externalContracts || {} };

  // Load in your local 📝 contract and read a value from it:
  const readContracts = useContractLoader(localProvider, contractConfig);

  // If you want to make 🔐 write transactions to your contracts, use the userSigner:
  const writeContracts = useContractLoader(userSigner, contractConfig, localChainId);

  // EXTERNAL CONTRACT EXAMPLE:
  //
  // If you want to bring in the mainnet DAI contract it would look like:
  const mainnetContracts = useContractLoader(mainnetProvider, contractConfig);

  const marketAddy=  readContracts && readContracts.Marketplace && readContracts.Marketplace.address;

  // const marketContractAddress = useContractReader(readContracts, "Marketplace", "address");
  const balance = useContractReader(readContracts, "Floor101", "balanceOf", [address]);
   const yourBalance = balance && balance.toNumber && balance.toNumber();
  const floorDaiBalance = useContractReader(readContracts, "Floor101", "getDaiContractBalance"); 
  const id = useContractReader(readContracts, "Floor101", "tokenOfOwnerByIndex", 0);

  const [yourCollectibles, setYourCollectibles] = useState();

  let s_total_nfts =  useContractReader(readContracts, "Floor101", "totalSupply");  
  let s_total_usdc =  useContractReader(readContracts, "Floor101", "getUSDCContractBalance");  
   
  const [saleNFTID, setSaleNFTID] = useState();
  const [lendButton, setLendButton] = useState(false);
  const [approveButton, setApproveButton] = useState(false); 

  // const listCancelSaleEvents = useEventListener(readContracts, "Marketplace", "Event_cancelSale ", localProvider, 1);
  const listSaleEvents = useEventListener(readContracts, "Marketplace", "saleListingEvent ", localProvider, 1); 
  const mintEvents = useEventListener(readContracts, "Floor101", "mintEvent", localProvider, 1);
  const lendEvent = useEventListener(readContracts, "Marketplace", "lendEvent", localProvider, 1);
  const repayLoanEvent = useEventListener(readContracts, "Marketplace", "repayLoanEvent", localProvider, 1);  
  
  const saleItems =  useContractReader(readContracts, "Marketplace", "nftListings");  

  let daiBalance =  useContractReader(readContracts, "Dai", "balanceOf", "0x99bbA657f2BbC93c02D617f8bA121cB8Fc104Acf");
  // If you want to call a function on a new block
  useOnBlock(mainnetProvider, () => {
    console.log(`⛓ A new mainnet block is here: ${mainnetProvider._lastBlockNumber}`);
  });

  const [value, setValue] = useState(2);
  const onChange = (e) => {
    console.log('radio checked', e.target.value);
    setValue(e.target.value);
  };

 function getDate(dt) {
      const milliseconds = dt * 1000 // 1575909015000
      const dateObject = new Date(milliseconds)
      let humanDateFormat = dateObject.toLocaleString() //2019-12-9 10:30:15
      setDate(humanDateFormat);
    }

  const [dat, setDate] = useState("0");

 // let tId = useContractReader( readContracts, "Floor101", "tokenOfOwnerByIndex", readContracts.Marketplace.address, 0);  

 const handle = async () =>{ 

   if (value==2)  // 2 week loan 
    {
    await tx( writeContracts.Marketplace.lend(NFTid, value,{value: ethers.utils.parseEther("0.0006")}));}
  else if (value==4) // 4 week loan
   { await tx( writeContracts.Marketplace.lend(NFTid, value,{value: ethers.utils.parseEther("0.0012")})); }
      
  else { alert("error calculating fee")  ; 
  return;}
  setApproveButton(false)
  setLendButton(true)  
}
const approve = async () =>{
  try{
    await tx( writeContracts.Floor101.approve(readContracts.Marketplace.address, NFTid));
    setLendButton(false);
    setApproveButton(true) ;
  }catch(e) {alert (e); console.log(e);}
  
}

  useEffect(() => {
    const updateYourCollectibles = async () => {
      const collectibleUpdate = [];
      for (let tokenIndex = 0; tokenIndex < balance; tokenIndex++) {
        try {
          
          const tokenId = await readContracts.Floor101.tokenOfOwnerByIndex(address, tokenIndex);
          let tokenURI = await readContracts.Floor101.tokenURI(tokenId);
          const jsonManifestString = atob(tokenURI.substring(29))
          try {
            const jsonManifest = JSON.parse(jsonManifestString);
            collectibleUpdate.push({ id: tokenId, uri: tokenURI, owner: address, ...jsonManifest });
          } catch (e) {
            console.log(e);
          }
        } catch (e) {
          console.log(e);
        }
      }
      setYourCollectibles(collectibleUpdate.reverse());
    };
    updateYourCollectibles();
  }, [address, yourBalance]);

  const getSales = async () =>{ 
    try {
      const salesUpdate = [];
      const jsonManifestString = atob(saleItems.toString())
      const jsonManifest = JSON.parse(jsonManifestString);
      console.log
    //  {saleItems[0][1] && saleItems[0][1].toString()}
    } catch (e) {
      console.log(e);
    }
  }


  const [NFTid, setNFTid] = useState("0");
  const [nftSalePrice, setNFTSalePrice] = useState("0"); 

  // input number handler
  const onChange2 = value => {
    setNFTid(value);
  };
  // input number handler
  const onChange3 = value => {
    setNFTSalePrice(value);
  };
  //
  // 🧫 DEBUG 👨🏻‍🔬
  //
  useEffect(() => {
    if (
      DEBUG &&
      mainnetProvider &&
      address &&
      selectedChainId &&
      yourLocalBalance &&
      yourMainnetBalance &&
      readContracts &&
      writeContracts &&
      mainnetContracts
    ) {
      console.log("_____________________________________ 🏗 scaffold-eth _____________________________________");
      console.log("🌎 mainnetProvider", mainnetProvider);
      console.log("🏠 localChainId", localChainId);
      console.log("👩‍💼 selected address:", address);
      console.log("🕵🏻‍♂️ selectedChainId:", selectedChainId);
      console.log("📝 readContracts", readContracts);
      console.log("🔐 writeContracts", writeContracts);
    }
  }, [
    mainnetProvider,
    address,
    selectedChainId,
    yourLocalBalance,
    yourMainnetBalance,
    readContracts,
    writeContracts,
    mainnetContracts,
  ]);

  let networkDisplay = "";
  if (NETWORKCHECK && localChainId && selectedChainId && localChainId !== selectedChainId) {
    const networkSelected = NETWORK(selectedChainId);
    const networkLocal = NETWORK(localChainId);
    if (selectedChainId === 1337 && localChainId === 31337) {
      networkDisplay = (
        <div style={{ zIndex: 2, position: "absolute", right: 0, top: 60, padding: 16 }}>
          <Alert
            message="⚠️ Wrong Network ID"
            description={
              <div>
                You have <b>chain id 1337</b> for localhost and you need to change it to <b>31337</b> to work with
                HardHat.
                <div>(MetaMask -&gt; Settings -&gt; Networks -&gt; Chain ID -&gt; 31337)</div>
              </div>
            }
            type="error"
            closable={false}
          />
        </div>
      );
    } else {
      networkDisplay = (
        <div style={{ zIndex: 2, position: "absolute", right: 0, top: 60, padding: 16 }}>
          <Alert
            message="⚠️ Wrong Network"
            description={
              <div>
                You have <b>{networkSelected && networkSelected.name}</b> selected and you need to be on{" "}
                <Button  type="primary"
                  onClick={async () => {
                    const ethereum = window.ethereum;
                    const data = [
                      {
                        chainId: "0x" + targetNetwork.chainId.toString(16),
                        chainName: targetNetwork.name,
                        nativeCurrency: targetNetwork.nativeCurrency,
                        rpcUrls: [targetNetwork.rpcUrl],
                        blockExplorerUrls: [targetNetwork.blockExplorer],
                      },
                    ];
                    console.log("data", data);

                    let switchTx;
                    // https://docs.metamask.io/guide/rpc-api.html#other-rpc-methods
                    try {
                      switchTx = await ethereum.request({
                        method: "wallet_switchEthereumChain",
                        params: [{ chainId: data[0].chainId }],
                      });
                    } catch (switchError) {
                      // not checking specific error code, because maybe we're not using MetaMask
                      try {
                        switchTx = await ethereum.request({
                          method: "wallet_addEthereumChain",
                          params: data,
                        });
                      } catch (addError) {
                        // handle "add" error
                      }
                    }

                    if (switchTx) {
                      console.log(switchTx);
                    }
                  }}
                >
                  <b>{networkLocal && networkLocal.name}</b>
                </Button>
              </div>
            }
            type="error"
            closable={false}
          />
        </div>
      );
    }
  } else {
    networkDisplay = (
      <div style={{ zIndex: -1, position: "absolute", right: 154, top: 28, padding: 16, color: targetNetwork.color }}>
        {targetNetwork.name}
      </div>
    );
  }

  const loadWeb3Modal = useCallback(async () => {
    const provider = await web3Modal.connect();
    setInjectedProvider(new ethers.providers.Web3Provider(provider));

    provider.on("chainChanged", chainId => {
      console.log(`chain changed to ${chainId}! updating providers`);
      setInjectedProvider(new ethers.providers.Web3Provider(provider));
    });

    provider.on("accountsChanged", () => {
      console.log(`account changed!`);
      setInjectedProvider(new ethers.providers.Web3Provider(provider));
    });

    // Subscribe to session disconnection
    provider.on("disconnect", (code, reason) => {
      console.log(code, reason);
      logoutOfWeb3Modal();
    });
  }, [setInjectedProvider]);

  useEffect(() => {
    if (web3Modal.cachedProvider) {
      loadWeb3Modal();
    }
  }, [loadWeb3Modal]);

  const [route, setRoute] = useState();
  useEffect(() => {
    setRoute(window.location.pathname);
  }, [setRoute]);

  let faucetHint = "";
  const faucetAvailable = localProvider && localProvider.connection && targetNetwork.name.indexOf("local") !== -1;

  const [faucetClicked, setFaucetClicked] = useState(false);
  if (
    !faucetClicked &&
    localProvider &&
    localProvider._network &&
    localProvider._network.chainId === 31337 &&
    yourLocalBalance &&
    ethers.utils.formatEther(yourLocalBalance) <= 0
  ) {
    faucetHint = (
      <div style={{ padding: 16 }}>
        <Button
          type="primary"
          onClick={() => {
            faucetTx({
              to: address,
              value: ethers.utils.parseEther(".05"),
            });
            setFaucetClicked(true);
          }}
        >
          💰 Grab funds from the faucet ⛽️
        </Button>
      </div>
    );
  }

  return (
    <div className="App">
      {/* ✏️ Edit the header and change the title to your project name */}
      <Header />
      {networkDisplay}
      <BrowserRouter>
        <Menu style={{ textAlign: "center" }} selectedKeys={[route]} mode="horizontal">
          <Menu.Item key="/">
            <Link
              onClick={() => {
                setRoute("/");
              }}
              to="/"
            >
             Mint
            </Link>
          </Menu.Item>

          <Menu.Item key="/market">
            <Link
              onClick={() => {
                setRoute("/market");
              }}
              to="/market"
            >
           Lend
            </Link>
          </Menu.Item> 
          <Menu.Item key="/about">
            <Link
              onClick={() => {
                setRoute("/about");
              }}
              to="/about"
            >
             About
            </Link>
          </Menu.Item>  
          <Menu.Item key="/debug">
            <Link
              onClick={() => {
                setRoute("/debug");
              }}
              to="/debug"
            >
              Debug
            </Link>
          </Menu.Item>
          <Menu.Item key="/forsale">
            <Link
              onClick={() => {
                setRoute("/forsale");
              }}
              to="/forsale"
            >For Sale
            </Link>
          </Menu.Item>         
        </Menu>

        <Switch>
     <Route exact path="/">
       <div style={{ width: 400, margin: "auto"}}>
      <div id="centerWrapper" style={{ padding: 16 }}>
      <div><h2>MINT FLOOR 101 nft</h2></div>
      <p> <b>NFTs Minted : </b>{ s_total_nfts && s_total_nfts.toString()}<br />
      <b>Available : </b>{(101- s_total_nfts).toString()}<br />
      <b>Mint price : </b>$100 DAI<br />
      <b>MAX LTV : </b> 100%
       </p>
 <Button type="primary" shape="round" onClick={() => {
           tx(writeContracts.Dai.approve(readContracts.Floor101.address, ethers.utils.parseEther("101")));
                  }}
                > APPROVE</Button>{' '}
      <Button type="primary" shape="round" onClick={() => {tx(writeContracts.Floor101.mintWithDAI());}}>MINT NFT</Button>
              
      <div><table width={400} id="cssTable"><tr><td width={45}></td><td>
<List dataSource={yourCollectibles} renderItem={item => {
                    return (
<List.Item>
<a href={"https://opensea.io/assets/"+(readContracts && readContracts.Floor101 && readContracts.Floor101.address)+"/"+item.id} target="_blank">{<img src= {item.image} class="center"  />} </a>
 </List.Item>
);}}/></td></tr></table>
</div></div>
<List bordered dataSource={mintEvents} renderItem={item => {
                  return (
                    <List.Item key={item[0] }>
                      <span style={{ fontSize: 16, marginRight: 8 }}>#{item.args[1].toNumber()}</span>
                      <Address address={item.args[0]} fontSize={16} /> 
                    </List.Item>
                  );
                }}
              />
             <Divider />
          </div>
          </Route>
          <Route exact path="/debug">

 <Contract
            name="Floor101"
            price={price}
            signer={userSigner}
            provider={localProvider}
            address={address}
            blockExplorer={blockExplorer}
            contractConfig={contractConfig}
          />
 <Contract
            name="Dai"
            price={price}
            signer={userSigner}
            provider={localProvider}
            address={address}
            blockExplorer={blockExplorer}
            contractConfig={contractConfig}
          />  
   <Contract
            name="Marketplace"
            price={price}
            signer={userSigner}
            provider={localProvider}
            address={address}
            blockExplorer={blockExplorer}
            contractConfig={contractConfig}
          /> 
        </Route>
          
  <Route exact path="/market">
  <div style={{ width: 480, margin: "auto", backgroundColor: "Off-White", border:2}}>
   <h1>Lending V1</h1>
  <p>Lending available 2 weeks after launch date.<br />
   Lend 100% of floor value of your NFT. <br />
   Lending fee of 0.0006 eth ($1) to lend for 2 weeks and 0.0012 eth for 4 weeks.<br />
   Can only get liquidated by not repaying loan before end date.<br />
   Liquidated NFTs will be resold through our marketplace contract for above the floor price or permanently burned.</p>
   <h1>Lending Instructions</h1>
   <p>Lending is currently fixed price, you will receive $100 Dai<br />

   Enter your NFT ID, select loan length (2 or 4 weeks) and click the approve button, once the transaction is approved 
   click on the lend button and the floor price of $100 dai will be sent to your wallet.
  
   Available Dai in lending contract ${daiBalance && ethers.utils.formatEther(daiBalance)}<br /></p>

 <InputNumber min={1} max={101} placeholder={"NFT ID"} onChange={onChange2} style={{width: 200 }} /><br />
 <Radio.Group onChange={onChange} value={value}>
      <Radio value={2}>2 weeks</Radio>
      <Radio value={4}>4 weeks</Radio>
    </Radio.Group><br />
 <Button type="primary" shape="round" disabled={approveButton} onClick={approve}> APPROVE </Button> {' '}
 <Button type="primary" shape="round" disabled={lendButton} onClick={handle}>LEND</Button><br />
  <List dataSource={lendEvent}   
                renderItem={item => {
                  return (
                    <List.Item key={item[0] }>
                     <p><h4>Loan Details</h4>
                     <b>NFT ID # </b>{item.args[0].toNumber()}<br />
                     <b>Loan amount : </b>${ ethers.utils.formatEther( item.args[2] ) }<br />
                     <b>Due Date : </b> { getDate(item.args[4])   }{dat }<br />
                     <b>Address : </b> {item.args[1]}  </p>
                    </List.Item>
                  );
                }}
              />
 <Divider />
 <h1>Repay Loan</h1>
 <p> Enter the number of your NFT, click approve and then Repay Loan, 
 you will need to have at least $100 dai in your account to repay the loan</p>
 <Button onClick={() => {tx( writeContracts.Dai.approve(readContracts.Marketplace.address,  ethers.utils.parseEther("100")));}}>APPROVE </Button>
 <Button onClick={() =>{console.log("nft fi ---------------", NFTid);
  tx( writeContracts.Marketplace.repayLoan(NFTid))}}>
 REPAY LOAN</Button>
<br />
<List bordered dataSource={repayLoanEvent}   
                renderItem={item => {
                  return (
                    <List.Item key={item[0] }>
                      <span style={{ fontSize: 16, marginRight: 8 }}><b>Loan for NFTID #{item.args[0].toNumber()} has been repaid</b></span>
                      <span style={{ fontSize: 16, marginRight: 8 }}>Repayment amount ${ ethers.utils.formatEther( item.args[2] ) }</span><br />
                      Address {item.args[1]}  
                    </List.Item>
                  );
                }}
              />
     </div>
 
     <Button onClick={() => {tx( writeContracts.Marketplace.liquidate( NFTid, ethers.utils.parseEther("120")));}}> LIQUIDATE </Button>
     <List bordered dataSource={listSaleEvents}   
                renderItem={item => {
                  return (
                    <List.Item key={item[0] }>
                      <span style={{ fontSize: 16, marginRight: 8 }}>NFTID #{item.args[1].toNumber()}</span>
                      <span style={{ fontSize: 16, marginRight: 8 }}>Price ${ ethers.utils.formatEther( item.args[2] ) }</span><br />
                      Address {item.args[0]}  
                    </List.Item>
                  );
                }}
              />
</Route>
 <Route exact path="/about">
 <div style={{ width: 420, margin: "auto", backgroundColor: "Off-White", border:2}}>
 <h1>About Floor 101</h1> 
 <p><b>Supply :</b> 101 NFTs<br />
    <b>Price :</b> $100 DAI<br />
    <b>Limit :</b> 1 per wallet<br />
    <b>Lend :</b> 100% of your investment less $1 eth fee<br />
    <b>Lending :</b> Available 2 weeks after first mint.</p>
   <h1>Project Revenue</h1> 
   <p>Loan fees and liquidations<br />
     Investing DAI into Gains Network Staking and other stablecoin staking options<br />
     Selling liquidated NFTs , Opensea Sales Royalties</p>
     <h1>Utility</h1>
     <p>Whitelisted to future NFT releases<br />
    Lend 100% of floor(treasury) value of NFT - the treasury should increase over time.</p>        
     <h1>Future Revenues</h1>
     <p>Listing fees on our NFT marketplace<br />
     Extending lending to other NFT projects<br />
     Future : NFT Stablecoin / Remitance, Lotto ?</p>
     </div>
    </Route>
 <Route exact path="/forsale">
     <div>Liquidated NFTs for sale</div>

     <Divider />

<h2>Market balance is {  s_total_nfts && s_total_nfts.toString()} {marketAddy} nftSALE ID is {saleNFTID}</h2>
<button >Test</button><br />


 DAI owned by protocol ${s_total_usdc && ethers.utils.formatEther(s_total_usdc)}<br />
 <h2>For Sale</h2>
<h2>MarketPlace</h2> 
<InputNumber min={1} max={151} placeholder={"NFT ID"} onChange={onChange2} style={{ width: 200 }} /><br />
<InputNumber min={1} placeholder={"Sale Price in Dai/USD"} onChange={onChange3} style={{ width: 200 }} /><br />
<Button onClick={() => {tx( writeContracts.Floor101.approve(readContracts.Marketplace.address, NFTid));}}> APPROVE </Button>
<Button onClick={() =>{tx( writeContracts.Marketplace.listSale(NFTid, nftSalePrice ,{value: ethers.utils.parseEther("0.0006")}));}}>
SELL NFT</Button>

 </Route>
        </Switch>
      </BrowserRouter>

      <ThemeSwitch />

      {/* 👨‍💼 Your account is in the top right with a wallet at connect options */}
      <div style={{ position: "fixed", textAlign: "right", right: 0, top: 0, padding: 10 }}>
        <Account
          address={address}
          localProvider={localProvider}
          userSigner={userSigner}
          mainnetProvider={mainnetProvider}
          price={price}
          web3Modal={web3Modal}
          loadWeb3Modal={loadWeb3Modal}
          logoutOfWeb3Modal={logoutOfWeb3Modal}
          blockExplorer={blockExplorer}
        />
        {faucetHint}
      </div>

      {/* 🗺 Extra UI like gas price, eth price, faucet, and support: */}
      <div style={{ position: "fixed", textAlign: "left", left: 0, bottom: 20, padding: 10 }}>
        <Row align="middle" gutter={[4, 4]}>
          <Col span={24}>
            {
              /*  if the local provider has a signer, let's show the faucet:  */
              faucetAvailable ? (
                <Faucet localProvider={localProvider} price={price} ensProvider={mainnetProvider} />
              ) : (
                ""
              )
            }
          </Col>
        </Row>
      </div>
    </div>
  );
}

export default App;
