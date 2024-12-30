// App.js
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { connect } from "./redux/blockchain/blockchainActions";
import { initializeContract, fetchData, fetchTimeUntilYoinkable } from "./redux/data/dataActions";
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
  const data = useSelector((state) => state.data);
  const [targetAddress, setTargetAddress] = useState(""); // Input for yoinkTo address
  const [timeUntilYoinkable, setTimeUntilYoinkable] = useState(0);
  const [holdingJoint, setHoldingJoint] = useState(false); // Tracks if the user holds token 0

  const handleConnectWallet = () => {
    dispatch(connect());
  };

  useEffect(() => {
    if (blockchain.account && blockchain.web3) {
      dispatch(initializeContract());
    }
  }, [blockchain.account, blockchain.web3, dispatch]);

  useEffect(() => {
    if (blockchain.account && blockchain.contract) {
      checkHoldingJoint();
      fetchTime();
    }
  }, [blockchain.account, blockchain.contract]);

  const checkHoldingJoint = async () => {
    try {
      const ownerOfToken0 = await blockchain.contract.methods.ownerOf(0).call();
      setHoldingJoint(ownerOfToken0.toLowerCase() === blockchain.account.toLowerCase());
    } catch (error) {
      console.error("Error checking ownership of token 0:", error);
    }
  };

  const fetchTime = async () => {
    try {
      const time = await blockchain.contract.methods.timeUntilYoinkable().call();
      setTimeUntilYoinkable(parseInt(time, 10));
    } catch (error) {
      console.error("Error fetching timeUntilYoinkable:", error);
    }
  };

  // Update the timeUntilYoinkable every second
  useEffect(() => {
    const interval = setInterval(() => {
      if (blockchain.contract) fetchTime();
    }, 1000);

    return () => clearInterval(interval);
  }, [blockchain.contract]);

  const handleYoink = async () => {
    try {
      if (!holdingJoint) {
        alert("Not holding the joint");
        return;
      }

      const tx = await blockchain.contract.methods.yoink().send({ from: blockchain.account });
      console.log("Yoink transaction successful:", tx);
      dispatch(fetchData());
    } catch (error) {
      console.error("Error during yoink:", error);
    }
  };

  const handleYoinkTo = async () => {
    if (!holdingJoint) {
      alert("Not holding the joint");
      return;
    }

    if (!blockchain.web3.utils.isAddress(targetAddress)) {
      alert("Invalid address");
      return;
    }

    try {
      const tx = await blockchain.contract.methods.yoinkTo(targetAddress).send({ from: blockchain.account });
      console.log("YoinkTo transaction successful:", tx);
      dispatch(fetchData());
    } catch (error) {
      console.error("Error during yoinkTo:", error);
    }
  };

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
            <StyledButton onClick={handleYoink}>Yoink</StyledButton>
            <StyledInput
              type="text"
              placeholder="Enter address to yoink to"
              value={targetAddress}
              onChange={(e) => setTargetAddress(e.target.value)}
            />
            <StyledButton onClick={handleYoinkTo}>YoinkTo</StyledButton>
            {!holdingJoint && (
              <s.TextDescription style={{ textAlign: "center", marginTop: 10 }}>
                Not holding the joint
              </s.TextDescription>
            )}
          </YoinkSection>
        )}
      </s.Container>
    </s.Screen>
  );
}

export default App;
