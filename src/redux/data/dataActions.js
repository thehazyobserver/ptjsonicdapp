// src/redux/data/dataActions.js
import { PassTheJointContract } from './contracts'; // Ensure the contract is imported correctly
import defaultImage from '../../assets/images/JOINTPACK.jpg'; // Ensure the default image is correctly imported

// Initialize the PassTheJoint contract
export const initializeContract = (contractAddress) => {
  return async (dispatch, getState) => {
    try {
      const { web3, account } = getState().blockchain;
      if (!web3 || !account) {
        throw new Error("Web3 or account not found");
      }

      if (!contractAddress) {
        throw new Error("Contract address not specified");
      }

      const passTheJoint = new web3.eth.Contract(PassTheJointContract.abi, contractAddress);
      dispatch({ type: 'SET_PASSTHEJOINT_CONTRACT', payload: passTheJoint });
    } catch (error) {
      console.error("Error initializing PassTheJoint contract:", error);
    }
  };
};

// Fetch data including NFTs and token 0 ownership
export const fetchData = () => {
  return async (dispatch, getState) => {
    try {
      const { account, PassTheJoint } = getState().blockchain;
      if (!account || !PassTheJoint) {
        throw new Error("Account or PassTheJoint contract not found");
      }

      // Fetch user's balance and NFTs
      const balance = await PassTheJoint.methods.balanceOf(account).call();
      const nftData = [];
      for (let i = 0; i < balance; i++) {
        const tokenId = await PassTheJoint.methods.tokenOfOwnerByIndex(account, i).call();
        nftData.push({ tokenId: tokenId.toString(), image: defaultImage }); // Convert BigInt to string and use the default image
      }

      // Check ownership of token 0
      let isHoldingToken0 = false;
      try {
        const ownerOfToken0 = await PassTheJoint.methods.ownerOf(0).call();
        isHoldingToken0 = ownerOfToken0.toLowerCase() === account.toLowerCase();
      } catch (error) {
        console.warn("Token 0 does not exist or cannot be fetched.");
      }

      dispatch({ type: 'SET_NFTS', payload: nftData });
      dispatch({ type: 'SET_HOLDING_TOKEN0', payload: isHoldingToken0 });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
};

// Handle yoink action
export const yoink = () => {
  return async (dispatch, getState) => {
    try {
      const { account, PassTheJoint } = getState().blockchain;
      if (!account || !PassTheJoint) {
        throw new Error("Account or PassTheJoint contract not found");
      }

      const tx = await PassTheJoint.methods.yoink().send({ from: account });
      console.log("Yoink transaction successful:", tx);

      // Refresh data after successful yoink
      dispatch(fetchData());
    } catch (error) {
      console.error("Error during yoink:", error);
    }
  };
};

// Handle yoinkTo action
export const yoinkTo = (targetAddress) => {
  return async (dispatch, getState) => {
    try {
      const { account, PassTheJoint, web3 } = getState().blockchain;
      if (!account || !PassTheJoint || !web3) {
        throw new Error("Account, PassTheJoint contract, or web3 not found");
      }

      if (!web3.utils.isAddress(targetAddress)) {
        throw new Error("Invalid address");
      }

      const tx = await PassTheJoint.methods.yoinkTo(targetAddress).send({ from: account });
      console.log("YoinkTo transaction successful:", tx);

      // Refresh data after successful yoinkTo
      dispatch(fetchData());
    } catch (error) {
      console.error("Error during yoinkTo:", error);
    }
  };
};

export const fetchTimeUntilYoinkable = () => {
  return async (dispatch, getState) => {
    try {
      const { PassTheJoint } = getState().blockchain;
      if (!PassTheJoint) {
        throw new Error("PassTheJoint contract not found");
      }

      const timeUntilYoinkable = await PassTheJoint.methods.timeUntilYoinkable().call();
      dispatch({ type: 'SET_TIME_UNTIL_YOINKABLE', payload: parseInt(timeUntilYoinkable, 10) });
    } catch (error) {
      console.error("Error fetching timeUntilYoinkable:", error);
    }
  };
};
