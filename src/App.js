import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Web3 from "web3";
import { connect } from "./redux/blockchain/blockchainActions";
import { initializeContract } from "./redux/data/dataActions";
import contractABI from "./redux/blockchain/abis/erc721Abi.json"; // Your ABI
import * as s from "./styles/globalStyles";
import styled from "styled-components";

// Ethers v6 imports (for read-only enumeration)
import { JsonRpcProvider, Contract } from "ethers";

// ---------------- STYLED COMPONENTS --------------
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

const LeaderboardSection = styled.div`
  text-align: center;
  background-color: #0059d7;
  color: #ffffff;
  padding: 20px;

  .holder,
  .past-holders {
    margin-top: 20px;
  }

  ul {
    list-style: none;
    padding: 0;
    text-align: center;
  }

  li {
    border: 1px solid #ffffff;
    padding: 10px;
    margin: 5px 0;
    display: block;
    width: 90%;
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
    word-wrap: break-word;
  }

  #currentHolder {
    border: 1px solid #ffffff;
    padding: 10px;
    display: inline-block;
    width: 90%;
    max-width: 600px;
    word-wrap: break-word;
  }

  .button-container {
    position: absolute;
    top: 20px;
    right: 20px;
  }

  .button-container a {
    margin-right: 10px;
    display: inline-block;
  }

  .button-container img {
    width: 40px;
    height: 40px;
  }

  img.gif {
    width: 90%;
    max-width: 600px;
    margin: 20px auto;
    display: block;
  }

  @media (max-width: 600px) {
    .button-container {
      position: static;
      margin: 10px 0;
    }

    .button-container a {
      margin: 5px;
    }

    p {
      font-size: 16px;
    }
  }
`;

// Utility function to format seconds as h:m:s
const formatTime = (seconds) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${h}h ${m}m ${s}s`;
};

// ---------------- CONSTANTS ----------------
const CONTRACT_ADDRESS = "0x374b897AF1c0213cc2153a761A856bd80fb91c92";
const RPC_URL = "https://rpc.soniclabs.com";

function App() {
  const dispatch = useDispatch();
  const blockchain = useSelector((state) => state.blockchain);

  // Local state
  const [timeUntilYoinkable, setTimeUntilYoinkable] = useState(0);
  const [yoinkToAddress, setYoinkToAddress] = useState("");

  // Web3 contract for write calls (yoink, etc.)
  const [writeContract, setWriteContract] = useState(null);

  // Display: current holder (tokenId=0) + enumerated tokens
  const [currentHolder, setCurrentHolder] = useState("Loading...");
  const [allHolders, setAllHolders] = useState([]);

  // --------------------------------------------------------------------------
  // 1) Connect Wallet
  // --------------------------------------------------------------------------
  const handleConnectWallet = () => {
    dispatch(connect());
  };

  // --------------------------------------------------------------------------
  // 2) Write Calls with Web3
  // --------------------------------------------------------------------------
  const handleYoink = async () => {
    try {
      if (writeContract && blockchain.account) {
        await writeContract.methods.yoink().send({ from: blockchain.account });
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
      if (writeContract && blockchain.account) {
        await writeContract.methods.yoinkTo(yoinkToAddress).send({ from: blockchain.account });
        alert(`Yoinked to ${yoinkToAddress} successfully!`);
      } else {
        alert("Contract is not initialized or wallet not connected.");
      }
    } catch (error) {
      console.error("Error during yoinkTo:", error);
      alert("YoinkTo failed.");
    }
  };

  // --------------------------------------------------------------------------
  // 3) Initialize Web3 Contract for Writing
  // --------------------------------------------------------------------------
  useEffect(() => {
    if (blockchain.account && blockchain.web3) {
      dispatch(initializeContract());
      const web3 = blockchain.web3 || new Web3(RPC_URL);
      const initializedContract = new web3.eth.Contract(contractABI, CONTRACT_ADDRESS);
      setWriteContract(initializedContract);
    }
  }, [blockchain.account, blockchain.web3, dispatch]);

  // --------------------------------------------------------------------------
  // 4) Fetch Time Until Yoinkable (Web3 read)
  // --------------------------------------------------------------------------
  useEffect(() => {
    const fetchTime = async () => {
      try {
        const web3 = blockchain.web3 || new Web3(RPC_URL);
        const readContract = writeContract || new web3.eth.Contract(contractABI, CONTRACT_ADDRESS);

        const time = await readContract.methods.timeUntilYoinkable().call();
        setTimeUntilYoinkable(parseInt(time, 10));
      } catch (error) {
        console.error("Error fetching timeUntilYoinkable:", error);
        setTimeUntilYoinkable(0);
      }
    };

    fetchTime();
  }, [blockchain.web3, writeContract]);

  // --------------------------------------------------------------------------
  // 5) Fetch Holders with Ethers (Enumeration), No Log Queries
  // --------------------------------------------------------------------------
  useEffect(() => {
    const fetchHoldersEnumerable = async () => {
      try {
        const provider = new JsonRpcProvider(RPC_URL);
        const readOnlyContract = new Contract(CONTRACT_ADDRESS, contractABI, provider);

        // A) Current holder of tokenId=0
        try {
          const holder0 = await readOnlyContract.ownerOf(0);
          setCurrentHolder(holder0);
        } catch (error) {
          console.error("Error fetching current holder:", error);
          setCurrentHolder("Error fetching data");
        }

        // B) Enumerate all tokens in descending order
        try {
          const totalSupplyBN = await readOnlyContract.totalSupply();
          const totalSupply = Number(totalSupplyBN);

          const holdersReversed = [];
          for (let i = totalSupply - 1; i >= 0; i--) {
            const tokenIdBN = await readOnlyContract.tokenByIndex(i);
            const tokenId = Number(tokenIdBN);

            const tokenOwner = await readOnlyContract.ownerOf(tokenId);
            holdersReversed.push({ tokenId, owner: tokenOwner });
          }
          setAllHolders(holdersReversed);
        } catch (err) {
          console.error("Error enumerating token holders:", err);
          setAllHolders([]);
        }
      } catch (err) {
        console.error("Unexpected error in read-only fetch:", err);
      }
    };

    fetchHoldersEnumerable();
  }, []);

  // --------------------------------------------------------------------------
  // RENDER
  // --------------------------------------------------------------------------
  return (
    <s.Screen>
      {/* -------------- HEADER -------------- */}
      <Header>
        <LinksContainer>
          <a
            href="https://paintswap.io/sonic/collections/0x374b897af1c0213cc2153a761a856bd80fb91c92/nfts"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src="/images/paintswap.svg" alt="PaintSwap" />
          </a>
          <a
            href="https://x.com/PassThe_JOINT"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src="/images/x.png" alt="Twitter" />
          </a>
          <a
            href="https://t.me/jointonsonic/1"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src="/images/telegram.png" alt="Telegram" />
          </a>
          <a
            href="https://passthejoint.xyz/"
            target="_blank"
            rel="noopener noreferrer"
          >
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
        <img
          src="/images/PassTheJoint.gif"
          alt="Pass The Joint"
          style={{ width: "300px", height: "auto", marginTop: "20px" }}
        />

        {/* -------------- YOINK SECTION -------------- */}
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

              <p>
                <strong>View on Paintswap:</strong>{" "}
                <a
                  href="https://paintswap.io/sonic/collections/0x374b897af1c0213cc2153a761a856bd80fb91c92/nfts"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="black-link"
                >
                  Paintswap
                </a>
              </p>
            </>
          )}
        </YoinkSection>

        {/* -------------- HOW IT WORKS -------------- */}
        <HowItWorks>
          <h3>How It Works</h3>
          <p>
            <strong>Yoink:</strong> Someone’s hogging the joint? Take it for yourself,
            anon. If you haven’t had it yet, now’s your time to shine.
          </p>
          <p>
            <strong>Yoink To:</strong> Already had your turn? Pass the joint to another
            degen and keep the vibes rolling.
          </p>
          <p>
            Remember, you can only hold the joint once, but when you pass it, you’ll get a
            little gift to prove you were part of this legendary smoke sesh.
          </p>
          <p>This ain’t just a joint; it’s history. Let’s get the whole chain high.</p>
        </HowItWorks>

        {/* -------------- LEADERBOARD SECTION -------------- */}
        <LeaderboardSection>
<br />
          {/* Current Joint Holder: tokenId=0 */}
          <div className="holder">
            <h2>Current Joint Holder</h2>
            <p id="currentHolder">{currentHolder}</p>
          </div>

          {/* All tokens in descending order: "tokenId - owner" */}
          <div className="past-holders">
            <h2>Those who have hit the JOINT</h2>
            <ul id="pastHolders">
              {allHolders.map((item, index) => (
                <li key={index}>
                  {item.tokenId} - {item.owner}
                </li>
              ))}
            </ul>
          </div>
        </LeaderboardSection>
      </s.Container>
    </s.Screen>
  );
}

export default App;
