(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[405],{75557:function(e,t,n){(window.__NEXT_P=window.__NEXT_P||[]).push(["/",function(){return n(94215)}])},94215:function(e,t,n){"use strict";n.r(t),n.d(t,{default:function(){return c}});var a=n(85893),i=n(64319),s=n(98228),u=n(20137),p=n(67976),r=n(61744),y=n(241),o=n(64146),l=n(67294),d=JSON.parse('[{"inputs":[{"internalType":"string","name":"name","type":"string"},{"internalType":"string","name":"symbol","type":"string"},{"internalType":"string","name":"baseTokenURI","type":"string"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"approved","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"operator","type":"address"},{"indexed":false,"internalType":"bool","name":"approved","type":"bool"}],"name":"ApprovalForAll","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[],"name":"_baseTokenURI","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_mintAmount","type":"uint256"},{"internalType":"address","name":"_to","type":"address"}],"name":"adminMint","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"approve","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes","name":"sig","type":"bytes"}],"name":"claim","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"cost","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"freezeBaseURI","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"getApproved","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"operator","type":"address"}],"name":"isApprovedForAll","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_address","type":"address"}],"name":"isBlacklisted","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"max","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"maxMintPerTx","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_mintAmount","type":"uint256"}],"name":"mint","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"ownerOf","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"publicSaleStarted","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"bytes","name":"_data","type":"bytes"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"operator","type":"address"},{"internalType":"bool","name":"approved","type":"bool"}],"name":"setApprovalForAll","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"uri","type":"string"}],"name":"setBaseTokenURI","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"price","type":"uint256"}],"name":"setCost","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"signer","type":"address"}],"name":"setWLSigner","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"startPublicSale","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"startWLMint","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes4","name":"interfaceId","type":"bytes4"}],"name":"supportsInterface","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"}],"name":"tokenByIndex","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"uint256","name":"index","type":"uint256"}],"name":"tokenOfOwnerByIndex","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"tokenURI","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"tokenURIFrozen","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"transferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_owner","type":"address"}],"name":"walletOfOwner","outputs":[{"internalType":"uint256[]","name":"","type":"uint256[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_mintAmount","type":"uint256"},{"internalType":"bytes","name":"sig","type":"bytes"}],"name":"whitelistMint","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"withdraw","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"wlMintStarted","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"wlSigner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"}]'),m=JSON.parse('[{"inputs":[{"internalType":"contract ERC721Enumerable","name":"addr","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[],"name":"alreadyListed","type":"error"},{"inputs":[],"name":"cantBorrowThatMuch","type":"error"},{"inputs":[],"name":"notEnoughETH","type":"error"},{"inputs":[],"name":"notOwner","type":"error"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":false,"internalType":"uint256","name":"tokenId","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"liquidationPrice","type":"uint256"}],"name":"liquidationEvent","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"sender","type":"address"},{"indexed":false,"internalType":"uint256","name":"NFTid","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"collectionID","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"loanAmount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"dueDate","type":"uint256"}],"name":"loanEvent","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"NFTid","type":"uint256"},{"indexed":true,"internalType":"address","name":"sender","type":"address"},{"indexed":false,"internalType":"uint256","name":"loanAmount","type":"uint256"}],"name":"repayLoanEvent","type":"event"},{"inputs":[{"internalType":"contract ERC721Enumerable","name":"_nft","type":"address"},{"internalType":"uint256","name":"_collectionID","type":"uint256"},{"internalType":"uint256","name":"_maxLoan","type":"uint256"},{"internalType":"uint256","name":"_loanDecayRate","type":"uint256"},{"internalType":"uint256","name":"_maxDays","type":"uint256"}],"name":"addNFTCollection","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenID","type":"uint256"},{"internalType":"uint256","name":"collectionID","type":"uint256"}],"name":"calculateBorrowFee","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getBalance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"i","type":"uint256"}],"name":"getCollection","outputs":[{"internalType":"contract ERC721Enumerable","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenID","type":"uint256"},{"internalType":"uint256","name":"collectionID","type":"uint256"}],"name":"getDueDate","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"addr","type":"address"},{"internalType":"uint256","name":"cid","type":"uint256"},{"internalType":"uint256","name":"position","type":"uint256"}],"name":"getLoanID","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"addr","type":"address"},{"internalType":"uint256","name":"cid","type":"uint256"}],"name":"getMappingLength","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"i","type":"uint256"}],"name":"getMaxLoan","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"uint256","name":"loanLength","type":"uint256"},{"internalType":"uint256","name":"collectionID","type":"uint256"},{"internalType":"uint256","name":"_loanAmount","type":"uint256"}],"name":"lend","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"uint256","name":"collectionID","type":"uint256"}],"name":"liquidate","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"loanData","outputs":[{"internalType":"uint256","name":"collectionID","type":"uint256"},{"internalType":"uint256","name":"maxLoanAmount","type":"uint256"},{"internalType":"uint256","name":"loanDecayRate","type":"uint256"},{"internalType":"uint256","name":"maxDays","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"}],"name":"loans","outputs":[{"internalType":"uint256","name":"collectionID","type":"uint256"},{"internalType":"address","name":"owner","type":"address"},{"internalType":"uint256","name":"startDate","type":"uint256"},{"internalType":"uint256","name":"endDate","type":"uint256"},{"internalType":"uint256","name":"loanAmount","type":"uint256"},{"internalType":"uint256","name":"interestRate","type":"uint256"},{"internalType":"bool","name":"liquidated","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"address","name":"from","type":"address"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"bytes","name":"","type":"bytes"}],"name":"onERC721Received","outputs":[{"internalType":"bytes4","name":"","type":"bytes4"}],"stateMutability":"pure","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"uint256","name":"collectionID","type":"uint256"}],"name":"repayLoan","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_liquidationFee","type":"uint256"}],"name":"setLiquidationFee","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"collectionID","type":"uint256"},{"internalType":"uint256","name":"_amount","type":"uint256"},{"internalType":"uint256","name":"_decayRate","type":"uint256"},{"internalType":"uint256","name":"_maxDays","type":"uint256"}],"name":"setLoanData","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"}],"name":"userLoans","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"withdraw","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"withdrawAll","outputs":[],"stateMutability":"payable","type":"function"},{"stateMutability":"payable","type":"receive"}]');function c(){let e="0x0CbD649a6bC932D5F9e5A4ed9522120bCb42E433",[t,n]=(0,l.useState)(0),[c,b]=(0,l.useState)(0),[T,f]=(0,l.useState)(0),{address:w,isConnected:x}=(0,p.mA)(),[h,g]=(0,l.useState)(0),[v,M]=(0,l.useState)("0"),[D,I]=(0,l.useState)(.28),[k,E]=(0,l.useState)(1),[j,L]=(0,l.useState)(0),[N,_]=(0,l.useState)(0),[C,O]=(0,l.useState)(""),[S,F]=(0,l.useState)(""),A={address:"0x17f4BAa9D35Ee54fFbCb2608e20786473c7aa49f",abi:d},R={address:e,abi:m};(0,p.y2)({address:e,abi:m,eventName:"loanEvent",listener(e,t,n,a,i){O("sender: ".concat(e," NFTid ",t," Loan amount : ",r.formatEther(a)," Due date : ",W(i))),console.log("sender: ",e," NFTid ",t," Loan amount : ",a," Due date : ",W(i))}}),(0,p.y2)({address:e,abi:m,eventName:"repayLoanEvent",listener(e,t,n){F("sender: ".concat(t," NFTid ",e," Loan amount : ",r.formatEther(n))),console.log("sender: ",t," NFTid ",e," Loan amount : ",n)}});let{data:B,error:q}=(0,p.do)({...A,functionName:"balanceOf",args:[w]}),{data:P,error:U}=(0,p.do)({...A,functionName:"tokenOfOwnerByIndex",args:[w,h]}),{data:Z,error:z}=(0,p.do)({...R,functionName:"getBalance"}),{data:J,error:Q}=(0,p.do)({...R,functionName:"getMappingLength",args:[w,0]}),{data:V,error:H}=(0,p.do)({...R,functionName:"calculateBorrowFee",args:[v,0]});function W(e){let t=new Date(1e3*e);return t.toLocaleString()}(0,l.useEffect)(()=>{C&&O(C)},[C]),(0,l.useEffect)(()=>{V&&_(V)},[V]),(0,l.useEffect)(()=>{B&&n(B)},[B]),(0,l.useEffect)(()=>{P&&b(P)},[P]),(0,l.useEffect)(()=>{Z&&f(Z)},[Z]),(0,l.useEffect)(()=>{J&&L(J)},[J]);let X=async(t,n)=>{let a=new y.Q(window.ethereum),i=a.getSigner(),s=new o.Contract("0x17f4BAa9D35Ee54fFbCb2608e20786473c7aa49f",d,a),u=s.connect(i);try{await u.approve(e,n)}catch(p){alert(p,"approve error"),console.log(p)}},Y=0,G=e=>{try{E(e),Y=(.276-.005*e).toFixed(2),console.log("a  = fixed 1 ",Y),I(Y)}catch(t){console.log(t)}},K=e=>{I(e)},$=async(t,n)=>{let a=new y.Q(window.ethereum),i=a.getSigner(),s=new o.Contract(e,m,a),u=s.connect(i);try{await u.lend(n,k,0,r.parseEther(D+""))}catch(p){alert(p,"Lend error"),console.log(p)}},ee=async(t,n)=>{try{let a=new y.Q(window.ethereum),i=a.getSigner(),s=new o.Contract(e,m,a),u=s.connect(i);await u.repayLoan(n,0,{value:N})}catch(p){alert(p,"repay error"),console.log(p)}},et=e=>{M(e)};return(0,a.jsxs)("div",{className:"container flex flex-col items-center mt-10",children:[(0,a.jsx)("div",{className:"flex mb-6",children:(0,a.jsx)(i.NL,{showBalance:!0})}),(0,a.jsx)("h1",{style:{fontSize:30},children:"FLOOR 101 NFT Lending (beta)"}),(0,a.jsxs)("h3",{className:"text-lg",children:["You own ",t.toString()," Blueberry,  ID : ",c.toString()]}),(0,a.jsxs)("h3",{className:"text-lg",children:["Lending Contract has ",r.formatEther(T.toString()).substring(0,6)," ETH available"]}),(0,a.jsx)("br",{}),"Enter NFT ID, choose length of loan and amount then approve and lend.",(0,a.jsxs)("table",{padding:25,children:[(0,a.jsxs)("tr",{children:[(0,a.jsx)("td",{children:"Nft ID : "}),(0,a.jsx)("td",{children:(0,a.jsx)(s.Z,{min:1,max:1e4,defaultValue:1,onChange:M,style:{width:200}})})]}),(0,a.jsxs)("tr",{children:[(0,a.jsx)("td",{children:"Loan Duration : "}),(0,a.jsx)("td",{children:(0,a.jsx)(s.Z,{min:1,max:28,placeholder:"Loan Duration",defaultValue:1,onChange:G,style:{width:200}})})]}),(0,a.jsxs)("tr",{children:[(0,a.jsx)("td",{children:"Loan Amount : "}),(0,a.jsx)("td",{children:(0,a.jsx)(s.Z,{min:.1,max:.276,step:.01,value:D,onChange:K,style:{width:200}})})]})]}),(0,a.jsx)("table",{children:(0,a.jsxs)("tr",{children:[(0,a.jsx)("td",{children:(0,a.jsx)("button",{class:"h-10 px-5 text-indigo-100 transition-colors duration-150 bg-blue-700 rounded-full focus:shadow-outline hover:bg-indigo-800",onClick:e=>X(e,c),children:"Approve"})}),(0,a.jsx)("td",{children:(0,a.jsx)("button",{class:"h-10 px-5 text-indigo-100 transition-colors duration-150 bg-blue-700 rounded-full focus:shadow-outline hover:bg-indigo-800",onClick:e=>$(e,v),children:"LEND"})})]})}),"Loan Details ",C,(0,a.jsx)(u.Z,{}),(0,a.jsx)("h1",{style:{fontSize:30},children:"Repay Loan"}),(0,a.jsx)(s.Z,{min:1,max:10100,placeholder:"NFT ID",onChange:et,style:{width:200,marginBottom:10}}),(0,a.jsx)("br",{}),(0,a.jsx)("button",{className:"h-10 px-5 text-indigo-100 transition-colors duration-150 bg-blue-700 rounded-full focus:shadow-outline hover:bg-indigo-800",onClick:e=>ee(e,v),children:"REPAY LOAN"}),"Repay Loan Details ",S,(0,a.jsx)(u.Z,{}),(0,a.jsx)("br",{}),(0,a.jsx)("a",{href:"https://arbiscan.io/address/0x0CbD649a6bC932D5F9e5A4ed9522120bCb42E433#code",rel:"noreferrer",class:"font-medium text-blue-600 dark:text-blue-500 hover:underline",target:"_blank",children:"View Contract"}),(0,a.jsx)("br",{}),(0,a.jsx)("a",{href:"https://twitter.com/pcashpeso",target:"_blank",rel:"noreferrer",class:"font-medium text-blue-600 dark:text-blue-500 hover:underline",children:"Click here for tech support on Twitter from Jollibee"})]})}}},function(e){e.O(0,[497,774,888,179],function(){return e(e.s=75557)}),_N_E=e.O()}]);