import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { connect } from "./redux/blockchain/blockchainActions";
import { initializeContract } from "./redux/data/dataActions";
import * as s from "./styles/globalStyles";
import styled from "styled-components";
import Web3 from "web3";

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
  const [timeUntilYoinkable, setTimeUntilYoinkable] = useState(0);

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
      try {
        const web3 = blockchain.web3 || new Web3("https://rpc.sonic.network"); // Use fallback Web3 if wallet not connected
        const contract = new web3.eth.Contract(
          [
            // Include minimal ABI to fetch `timeUntilYoinkable`
            { constant: true, inputs: [], name: "timeUntilYoinkable", outputs: [{ name: "", type: "uint256" }], type: "function" },
          ],
          "0x374b897AF1c0213cc2153a761A856bd80fb91c92" // Replace with CONFIG.CONTRACT_ADDRESS
        );

        const time = await contract.methods.timeUntilYoinkable().call();
        setTimeUntilYoinkable(parseInt(time, 10));
      } catch (error) {
        console.error("Error fetching timeUntilYoinkable:", error);
        setTimeUntilYoinkable(0); // Default fallback
      }
    };

    fetchTime();
  }, [blockchain.web3, blockchain.contract]);

  return (
    <s.Screen>
      <s.Container flex={1} ai={"center"} style={{ padding: 24 }}>
        <StyledButton onClick={handleConnectWallet}>
          {blockchain.account ? `Connected: ${blockchain.account}` : "Connect Wallet"}
        </StyledButton>
        <s.TextTitle style={{ textAlign: "center", fontSize: 30, marginTop: 20 }}>
          Pass the JOINT
        </s.TextTitle>
        <YoinkSection>
          <div className="yoink-timer">
            {timeUntilYoinkable > 0
              ? `Time Until Yoinkable: ${formatTime(timeUntilYoinkable)}`
              : "The joint is yoinkable now!"}
          </div>
        </YoinkSection>
      </s.Container>
    </s.Screen>
  );
}

export default App;
