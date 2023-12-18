import React from 'react';
import "./Coinflip.css";

const Coinflip = () => {
  return (
    <div id="coinflip">
      <div id="coin">
        <div className="side-a"></div>
        <div className="side-b"></div> 
      </div>

      <div>
          Bet:<input/>
          <h1>Click on coin to flip</h1>  
      </div>
    </div>
  );
};

export default Coinflip;