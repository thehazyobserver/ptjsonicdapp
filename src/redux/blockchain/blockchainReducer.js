const initialState = {
  loading: false,
  account: null,
  web3: null,
  contract: null, // Store the smart contract instance
  errorMsg: "", // General error message for the connection
};

const blockchainReducer = (state = initialState, action) => {
  switch (action.type) {
    case "CONNECT_REQUEST":
      return {
        ...state,
        loading: true,
        errorMsg: "", // Clear any previous connection errors
      };

    case "CONNECT_SUCCESS":
      return {
        ...state,
        loading: false,
        account: action.payload.account,
        web3: action.payload.web3,
        errorMsg: "", // Clear error messages on success
      };

    case "CONNECT_FAILED":
      return {
        ...state,
        loading: false,
        account: null, // Reset account if connection failed
        web3: null, // Clear web3 on failure
        contract: null, // Reset contract instance
        errorMsg: action.payload, // Set the error message for connection failure
      };

    case "SET_CONTRACT_INSTANCE":
      return {
        ...state,
        contract: action.payload, // Store the smart contract instance
      };

    case "UPDATE_ACCOUNT":
      return {
        ...state,
        account: action.payload.account,
        errorMsg: "", // Clear error messages on account update
      };

    case "RESET_BLOCKCHAIN":
      return {
        ...initialState,
        errorMsg: state.errorMsg, // Optionally preserve the last error message
      };

    default:
      return state;
  }
};

export default blockchainReducer;
