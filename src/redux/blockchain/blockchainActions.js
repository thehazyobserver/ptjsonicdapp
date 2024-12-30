import Web3 from "web3";

// Action Types
export const CONNECT_REQUEST = "CONNECT_REQUEST";
export const CONNECT_SUCCESS = "CONNECT_SUCCESS";
export const CONNECT_FAILED = "CONNECT_FAILED";
export const UPDATE_ACCOUNT = "UPDATE_ACCOUNT";

// Connect to the blockchain
export const connect = () => {
  return async (dispatch) => {
    dispatch({ type: CONNECT_REQUEST });

    if (!CONFIG) {
      console.error("CONFIG data is missing.");
      dispatch({
        type: CONNECT_FAILED,
        payload: "Configuration data is missing.",
      });
      return;
    }
    
    const CONFIG = getState().data.config; // Access the CONFIG from state
    if (!CONFIG) {
      console.error("Configuration data is missing.");
      dispatch({
        type: CONNECT_FAILED,
        payload: "Configuration data is missing.",
      });
      return;
    }

    if (window.ethereum) {
      try {
        const web3 = new Web3(window.ethereum);
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        const networkId = await window.ethereum.request({
          method: "net_version",
        });

        // Check if connected to the correct network
        if (networkId === CONFIG.NETWORK.ID.toString()) {
          // Dispatch connection success
          dispatch({
            type: CONNECT_SUCCESS,
            payload: {
              account: accounts[0],
              web3,
            },
          });

          // Listen for account changes
          window.ethereum.on("accountsChanged", (accounts) => {
            if (accounts.length > 0) {
              dispatch({
                type: UPDATE_ACCOUNT,
                payload: { account: accounts[0] },
              });
            } else {
              dispatch({
                type: CONNECT_FAILED,
                payload: "Please connect to a Web3 wallet.",
              });
            }
          });

          // Listen for network changes
          window.ethereum.on("chainChanged", () => {
            window.location.reload();
          });
        } else {
          console.error("Wrong network. Please switch to the correct network.");
          dispatch({
            type: CONNECT_FAILED,
            payload: `Please connect to the ${CONFIG.NETWORK.NAME} network.`,
          });
        }
      } catch (err) {
        console.error("Failed to connect to the blockchain:", err);
        dispatch({
          type: CONNECT_FAILED,
          payload: "Failed to connect to the blockchain.",
        });
      }
    } else {
      console.error("MetaMask or other Web3 wallet not detected.");
      dispatch({
        type: CONNECT_FAILED,
        payload: "Please install a Web3 wallet like MetaMask.",
      });
    }
  };
};
