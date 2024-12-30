function App() {
  const dispatch = useDispatch();
  const blockchain = useSelector((state) => state.blockchain);
  const [timeUntilYoinkable, setTimeUntilYoinkable] = useState(null);
  const [yoinkToAddress, setYoinkToAddress] = useState("");
  const [isLoadingYoink, setIsLoadingYoink] = useState(false);
  const [isLoadingYoinkTo, setIsLoadingYoinkTo] = useState(false);

  const handleConnectWallet = () => {
    dispatch(connect());
  };

  const handleYoink = async () => {
    setIsLoadingYoink(true);
    try {
      if (blockchain.contract) {
        await blockchain.contract.methods.yoink().send({ from: blockchain.account });
        alert("Yoink successful!");
      } else {
        alert("Contract is not initialized.");
      }
    } catch (error) {
      console.error("Error during yoink:", error);
      alert("Yoink failed. Please try again.");
    } finally {
      setIsLoadingYoink(false);
    }
  };

  const handleYoinkTo = async () => {
    if (!Web3.utils.isAddress(yoinkToAddress)) {
      alert("Please enter a valid Ethereum address.");
      return;
    }

    setIsLoadingYoinkTo(true);
    try {
      if (blockchain.contract) {
        await blockchain.contract.methods.yoinkTo(yoinkToAddress).send({ from: blockchain.account });
        alert(`Successfully yoinked to ${yoinkToAddress}!`);
      } else {
        alert("Contract is not initialized.");
      }
    } catch (error) {
      console.error("Error during yoinkTo:", error);
      alert("YoinkTo failed. Please try again.");
    } finally {
      setIsLoadingYoinkTo(false);
    }
  };

  useEffect(() => {
    if (blockchain.account && blockchain.web3) {
      dispatch(initializeContract());
    }
  }, [blockchain.account, blockchain.web3, dispatch]);

  useEffect(() => {
    const fetchTime = async () => {
      try {
        const web3 = blockchain.web3 || new Web3("https://sonic.drpc.org");
        const contract = new web3.eth.Contract(
          [
            {
              constant: true,
              inputs: [],
              name: "timeUntilYoinkable",
              outputs: [{ name: "", type: "uint256" }],
              type: "function",
            },
          ],
          "0x374b897AF1c0213cc2153a761A856bd80fb91c92"
        );

        const time = await contract.methods.timeUntilYoinkable().call();
        setTimeUntilYoinkable(parseInt(time, 10));
      } catch (error) {
        console.error("Error fetching timeUntilYoinkable:", error);
        setTimeUntilYoinkable(null);
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
            {timeUntilYoinkable === null
              ? "Unable to fetch Yoinkable time."
              : timeUntilYoinkable > 0
              ? `Time Until Yoinkable: ${formatTime(timeUntilYoinkable)}`
              : "The joint is yoinkable now!"}
          </div>
          {timeUntilYoinkable === 0 && (
            <>
              <StyledButton onClick={handleYoink} disabled={isLoadingYoink}>
                {isLoadingYoink ? "Processing Yoink..." : "Yoink"}
              </StyledButton>
              <InputField
                type="text"
                placeholder="Enter address to Yoink To"
                value={yoinkToAddress}
                onChange={(e) => setYoinkToAddress(e.target.value)}
              />
              <StyledButton onClick={handleYoinkTo} disabled={isLoadingYoinkTo}>
                {isLoadingYoinkTo ? "Processing YoinkTo..." : "Yoink To"}
              </StyledButton>
            </>
          )}
        </YoinkSection>
      </s.Container>
    </s.Screen>
  );
}

export default App;
