import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Web3 from "web3";
import { connect } from "./redux/blockchain/blockchainActions";
import { initializeContract } from "./redux/data/dataActions";
import contractABI from "./redux/blockchain/abis/erc721Abi.json"; // Import the ABI
import * as s from "./styles/globalStyles";
import styled from "styled-components";

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 10px;
  box-sizing: border-box;
`;

const StyledButton = styled.button`
  padding: 5px 10px;
  border-radius: 4px;
  border: none;
  background-color: black;
  font-weight: bold;
  color: white;
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

const InputField = styled.input`
  padding: 10px;
  margin-bottom: 10px;
  width: 100%;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const LinksContainer = styled.div`
  display: flex;
  align-items: center;

  a {
    margin: 0 10px;
    display: inline-block;
    text-decoration: none;
  }

  img {
    width: 40px;
    height: 40px;
  }
`;

const HowItWorks = styled.div`
  margin-top: 40px;
  padding: 20px;
  text-align: left;

  h3 {
    margin-bottom: 10px;
  }

  p {
    margin-bottom: 10px;
    line-height: 1.5;
  }
`;

const formatTime = (seconds) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${h}h ${m}m ${s}s`;
};

const CONTRACT_ADDRESS = "0x374b897AF1c0213cc2153a761A856bd80fb91c92";
const RPC_URL = "https://sonic.drpc.org";

function App() {
  const dispatch = useDispatch();
  const blockchain = useSelector((state) => state.blockchain);
  const [timeUntilYoinkable, setTimeUntilYoinkable] = useState(0);
  const [yoinkToAddress, setYoinkToAddress] = useState("");
  const [contract, setContract] = useState(null);

  const handleConnectWallet = () => {
    dispatch(connect());
  };

  const handleYoink = async () => {
    try {
      if (contract && blockchain.account) {
        await contract.methods.yoink().send({ from: blockchain.account });
        alert("Yoink successful!");
      } else {
        alert("Contract is not initialized or wallet not connected.");
      }
    } catch (error) {
      console.error("Error during yoink:", error);
      alert("Yoink failed.");
    }
  };

  const handleYoinkTo = async () => {
    try {
      if (contract && blockchain.account) {
        await contract.methods.yoinkTo(yoinkToAddress).send({ from: blockchain.account });
        alert(`Yoinked to ${yoinkToAddress} successfully!`);
      } else {
        alert("Contract is not initialized or wallet not connected.");
      }
    } catch (error) {
      console.error("Error during yoinkTo:", error);
      alert("YoinkTo failed.");
    }
  };

  useEffect(() => {
    if (blockchain.account && blockchain.web3) {
      dispatch(initializeContract());
      const web3 = blockchain.web3 || new Web3(RPC_URL);
      const initializedContract = new web3.eth.Contract(contractABI, CONTRACT_ADDRESS);
      setContract(initializedContract);
    }
  }, [blockchain.account, blockchain.web3, dispatch]);

  useEffect(() => {
    const fetchTime = async () => {
      try {
        const web3 = blockchain.web3 || new Web3(RPC_URL);
        const initializedContract = contract || new web3.eth.Contract(contractABI, CONTRACT_ADDRESS);
        const time = await initializedContract.methods.timeUntilYoinkable().call();
        setTimeUntilYoinkable(parseInt(time, 10));
      } catch (error) {
        console.error("Error fetching timeUntilYoinkable:", error);
        setTimeUntilYoinkable(0);
      }
    };

    fetchTime();
  }, [blockchain.web3, contract]);

  return (
    <s.Screen>
      <Header>
        <LinksContainer>
          <a href="https://paintswap.io/sonic/collections/0x374b897af1c0213cc2153a761a856bd80fb91c92/nfts" target="_blank" rel="noopener noreferrer">
            <img src="/images/paintswap.svg" alt="PaintSwap" />
          </a>
          <a href="https://x.com/PassThe_JOINT" target="_blank" rel="noopener noreferrer">
            <img src="/images/x.png" alt="Twitter" />
          </a>
          <a href="https://t.me/jointonsonic/1" target="_blank" rel="noopener noreferrer">
            <img src="/images/telegram.png" alt="Telegram" />
          </a>
        <a href="https://passthejoint.xyz/" target="_blank" rel="noopener noreferrer">
            <img src="images/PassTheJointme.gif" alt="Pass the JOINT" />
        </a>
        </LinksContainer>
        <StyledButton onClick={handleConnectWallet}>
          {blockchain.account ? `Connected: ${blockchain.account}` : "Connect Wallet"}
        </StyledButton>
      </Header>
      <s.Container flex={1} ai={"center"} style={{ padding: 24 }}>
        <s.TextTitle style={{ textAlign: "center", fontSize: 30, marginTop: 20 }}>
          Pass the JOINT
        </s.TextTitle>
        <img src="/images/PassTheJoint.gif" alt="Pass The Joint" style={{ width: "300px", height: "auto", marginTop: "20px" }} />
        <YoinkSection>
  <div className="yoink-timer">
    {timeUntilYoinkable > 0
      ? `Time Until Yoinkable: ${formatTime(timeUntilYoinkable)}`
      : "The joint is yoinkable now!"}
  </div>
  {timeUntilYoinkable <= 0 && (
    <>
      <p>Yoink for yourself</p>
      <StyledButton onClick={handleYoink}>Yoink</StyledButton>
      <p>Yoink and send to someone else</p>
      <InputField
        type="text"
        placeholder="Enter address to Yoink To"
        value={yoinkToAddress}
        onChange={(e) => setYoinkToAddress(e.target.value)}
      />
      <StyledButton onClick={handleYoinkTo}>Yoink To</StyledButton>
      <p><strong>View on Paintswap:</strong> <a href="https://paintswap.io/sonic/collections/0x374b897af1c0213cc2153a761a856bd80fb91c92/nfts" target="_blank" rel="noopener noreferrer" className="white-link">Paintswap</a></p>
    </>
  )}
</YoinkSection>
        <HowItWorks>
          <h3>How It Works</h3>
          <p><strong>Yoink:</strong> Someone’s hogging the joint? Take it for yourself, anon. If you haven’t had it yet, now’s your time to shine.</p>
          <p><strong>Yoink To:</strong> Already had your turn? Pass the joint to another degen and keep the vibes rolling.</p>
          <p>Remember, you can only hold the joint once, but when you pass it, you’ll get a little gift to prove you were part of this legendary smoke sesh.</p>
          <p>This ain’t just a joint; it’s history. Let’s get the whole chain high.</p>
        </HowItWorks>
      </s.Container>
    </s.Screen>
  );
}

export default App;
