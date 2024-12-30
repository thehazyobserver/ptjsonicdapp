import { PassTheJointContract } from './contracts'; // Ensure the contract is imported correctly
import defaultImage from '../../assets/images/JOINTPACK.jpg'; // Ensure the default image is correctly imported

// Helper function to handle errors
const handleError = (error, dispatch, actionType) => {
  console.error(error);
  dispatch({ type: actionType, payload: error.message || "An unknown error occurred" });
};

// Initialize the PassTheJoint contract
export const initializeContract = () => {
  return async (dispatch, getState) => {
    try {
      const { web3 } = getState().blockchain;
      if (!web3) {
        throw new Error("Web3 instance not found");
      }

      const passTheJoint = new web3.eth.Contract(
        PassTheJointContract.abi,
        PassTheJointContract.address
      );
      dispatch({ type: 'SET_CONTRACT_INSTANCE', payload: passTheJoint });
    } catch (error) {
      handleError(error, dispatch, 'SET_ERROR');
    }
  };
};

// Fetch data including NFTs and token 0 ownership
export const fetchData = () => {
  return async (dispatch, getState) => {
    try {
      const { account, contract } = getState().blockchain;
      if (!account || !contract) {
        throw new Error("Account or contract not found");
      }

      // Fetch user's NFTs
      const balance = await contract.methods.balanceOf(account).call();
      const nftData = await Promise.all(
        Array.from({ length: balance }).map(async (_, i) => {
          const tokenId = await contract.methods.tokenOfOwnerByIndex(account, i).call();
          return { tokenId: tokenId.toString(), image: defaultImage };
        })
      );

      // Check ownership of token 0
      const ownerOfToken0 = await contract.methods.ownerOf(0).call();
      const isHoldingToken0 = ownerOfToken0.toLowerCase() === account.toLowerCase();

      dispatch({ type: 'SET_NFTS', payload: nftData });
      dispatch({ type: 'SET_HOLDING_TOKEN0', payload: isHoldingToken0 });
    } catch (error) {
      handleError(error, dispatch, 'SET_ERROR');
    }
  };
};

// Handle yoink action
export const yoink = () => {
  return async (dispatch, getState) => {
    try {
      const { account, contract } = getState().blockchain;
      if (!account || !contract) {
        throw new Error("Account or contract not found");
      }

      await contract.methods.yoink().send({ from: account });
      dispatch(fetchData()); // Refresh data
    } catch (error) {
      handleError(error, dispatch, 'SET_ERROR');
    }
  };
};

// Handle yoinkTo action
export const yoinkTo = (targetAddress) => {
  return async (dispatch, getState) => {
    try {
      const { account, contract, web3 } = getState().blockchain;
      if (!account || !contract || !web3) {
        throw new Error("Account, contract, or Web3 not found");
      }

      if (!web3.utils.isAddress(targetAddress)) {
        throw new Error("Invalid address");
      }

      await contract.methods.yoinkTo(targetAddress).send({ from: account });
      dispatch(fetchData()); // Refresh data
    } catch (error) {
      handleError(error, dispatch, 'SET_ERROR');
    }
  };
};

// Fetch time until yoinkable
export const fetchTimeUntilYoinkable = () => {
  return async (dispatch, getState) => {
    try {
      const { contract } = getState().blockchain;
      if (!contract) {
        throw new Error("Contract not found");
      }

      const timeUntilYoinkable = await contract.methods.timeUntilYoinkable().call();
      dispatch({ type: 'SET_TIME_UNTIL_YOINKABLE', payload: parseInt(timeUntilYoinkable, 10) });
    } catch (error) {
      handleError(error, dispatch, 'SET_ERROR');
    }
  };
};
