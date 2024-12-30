// src/App.js
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { connect } from "./redux/blockchain/blockchainActions";
import { initializeContract, fetchData } from "./redux/data/dataActions";
import * as s from "./styles/globalStyles";
import styled from "styled-components";

const StyledButton = styled.button`
  padding: 10px;
  border-radius: 0;
  border: none;
  background-color: black;
  font-weight: bold;
  color: white;
  width: 100%;
  cursor: pointer;
  text-align: center;
  :hover {
    background-color: #444;
  }
`;

const StyledInput = styled.input`
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
  width: 100%;
  margin-bottom: 10px;
`;

const YoinkSection = styled.div`
  margin-top: 20px;
  text-align: center;

  .yoink-timer {
    font-size: 18px;
    font-weight: bold;
    color: var(--accent-text);
    margin-bottom: 10px;
  }
`;

const formatTime = (seconds) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${h}h ${m}m ${s}s`;
};

function App() {
  const dispatch = useDispatch();
  const blockchain = useSelector((state) => state.blockchain);
  const [targetAddress, setTargetAddress] = useState(""); 
  const [timeUntilYoinkable, setTimeUntilYoinkable] = useState(0);
  const [holdingJoint, setHoldingJoint] = useState(false); 

  const handleConnectWallet = () => {
    dispatch(connect());
  };

  useEffect(() => {
    if (blockchain.account && blockchain.web3) {
      dispatch(initializeContract());
    }
  }, [blockchain.account, blockchain.web3, dispatch]);

  useEffect(() => {
    const fetchTime = async () => {
      if (blockchain.contract) {
        try {
          const time = await blockchain.contract.methods.timeUntilYoinkable().call();
          setTimeUntilYoinkable(parseInt(time, 10));
        } catch (error) {
          console.error("Error fetching timeUntilYoinkable:", error);
        }
      }
    };

    const checkHoldingJoint = async () => {
      try {
        const ownerOfToken0 = await blockchain.contract.methods.ownerOf(0).call();
        setHoldingJoint(ownerOfToken0.toLowerCase() === blockchain.account.toLowerCase());
      } catch (error) {
        console.error("Error checking ownership of token 0:", error);
      }
    };

    if (blockchain.account && blockchain.contract) {
      fetchTime();
      checkHoldingJoint();
    }
  }, [blockchain.account, blockchain.contract]);

  return (
    <s.Screen>
      <s.Container flex={1} ai={"center"} style={{ padding: 24 }}>
        <StyledButton onClick={handleConnectWallet}>
          {blockchain.account ? `Connected: ${blockchain.account}` : "Connect Wallet"}
        </StyledButton>
        <s.TextTitle style={{ textAlign: "center", fontSize: 30, marginTop: 20 }}>
          Pass the JOINT
        </s.TextTitle>
        {blockchain.account && (
          <YoinkSection>
            <div className="yoink-timer">
              {timeUntilYoinkable > 0
                ? `Time Until Yoinkable: ${formatTime(timeUntilYoinkable)}`
                : "The joint is yoinkable now!"}
            </div>
          </YoinkSection>
        )}
      </s.Container>
    </s.Screen>
  );
}

export default App;
