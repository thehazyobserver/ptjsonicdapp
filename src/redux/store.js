import { applyMiddleware, compose, createStore, combineReducers } from "redux";
import thunk from "redux-thunk"; // Default import for thunk middleware
import blockchainReducer from "./blockchain/blockchainReducer";
import dataReducer from "./data/dataReducer";

// Combine all reducers into a single root reducer
const rootReducer = combineReducers({
  blockchain: blockchainReducer, // Handles blockchain-related state
  data: dataReducer, // Handles NFT and application data state
});

// Middleware: Add any middleware here (e.g., thunk for async actions)
const middleware = [thunk];

// Redux DevTools setup for development debugging
const composeEnhancers =
  (typeof window !== "undefined" && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose;

// Create the Redux store with middleware and enhancers
const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(...middleware)) // Apply middleware and enhancers
);

export default store;
