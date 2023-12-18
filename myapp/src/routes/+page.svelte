<script>

import { ethers } from "ethers";


async function connectMetamask()
{
  // A Web3Provider wraps a standard Web3 provider, which is
  // what MetaMask injects as window.ethereum into each page
  const provider = new ethers.JsonRpcProvider();

  // MetaMask requires requesting permission to connect users accounts
  let accounts = await provider.send("eth_requestAccounts", []);

  // The MetaMask plugin also allows signing transactions to
  // send ether and pay to change state within the blockchain.
  // For this, you need the account signer...
  const signer = provider.getSigner();

  console.log(provider, signer, accounts);
}

async function handleCoinflip()
{
    await connectMetamask();
}



// jquery(document).ready(function($){
//     $('#coin').on('click', function(){
//       var flipResult = Math.random();
//       $('#coin').removeClass();
//       setTimeout(function(){
//         if(flipResult <= 0.5){
//           $('#coin').addClass('heads');
//           console.log('it is head');
//         }
//         else{
//           $('#coin').addClass('tails');
//           console.log('it is tails');
//         }
//       }, 100);
//     });
//   });                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   
</script>

<style>
  #coin {
    position: relative;
    margin: 0 auto;
    width: 100px;
    height: 100px;
    cursor: pointer;
  }

  #coin div {
    width: 100%;
    height: 100%;
    -webkit-border-radius: 50%;
       -moz-border-radius: 50%;
            border-radius: 50%;
    -webkit-box-shadow: inset 0 0 45px rgba(255,255,255,.3), 0 12px 20px -10px rgba(0,0,0,.4);
       -moz-box-shadow: inset 0 0 45px rgba(255,255,255,.3), 0 12px 20px -10px rgba(0,0,0,.4);
            box-shadow: inset 0 0 45px rgba(255,255,255,.3), 0 12px 20px -10px rgba(0,0,0,.4);
  }

  .side-a {
    background-color: #bb0000;
  }
  .side-b {
    background-color: #3e3e3e;
  }
  
  #coin {
    transition: -webkit-transform 1s ease-in;
    -webkit-transform-style: preserve-3d;
  }
  
  #coin div {
    position: absolute;
    -webkit-backface-visibility: hidden;
  }

  .side-a {
    z-index: 100;
  }

  .side-b {
    -webkit-transform: rotateY(-180deg);
  
  }
  
  #coin.heads {
    -webkit-animation: flipHeads 3s ease-out forwards;
    -moz-animation: flipHeads 3s ease-out forwards;
      -o-animation: flipHeads 3s ease-out forwards;
         animation: flipHeads 3s ease-out forwards;
  }

  #coin.tails {
    -webkit-animation: flipTails 3s ease-out forwards;
    -moz-animation: flipTails 3s ease-out forwards;
      -o-animation: flipTails 3s ease-out forwards;
         animation: flipTails 3s ease-out forwards;
  }
  
  @-webkit-keyframes flipHeads {
    from { -webkit-transform: rotateY(0); -moz-transform: rotateY(0); transform: rotateY(0); }
    to { -webkit-transform: rotateY(1800deg); -moz-transform: rotateY(1800deg); transform: rotateY(1800deg); }
  }
  @-webkit-keyframes flipTails {
    from { -webkit-transform: rotateY(0); -moz-transform: rotateY(0); transform: rotateY(0); }
    to { -webkit-transform: rotateY(1980deg); -moz-transform: rotateY(1980deg); transform: rotateY(1980deg); }
  }
  
</style>

<div id="coin" on:click={() => handleCoinflip()}>
    <div class="side-a"></div>
    <div class="side-b"></div> 
</div>

<div style="text-align: center; padding-top: 10px;">
    Bet:<input/>
    <h1>Click on coin to flip</h1>  
</div>
