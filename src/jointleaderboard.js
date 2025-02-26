document.addEventListener('DOMContentLoaded', async () => {
    console.log("DOM fully loaded and parsed. Initializing script...");

    // Connect to Sonic blockchain using ethers.js
    console.log("Connecting to Sonic blockchain...");
    const provider = new ethers.providers.JsonRpcProvider('https://sonic.drpc.org');
    console.log("Provider initialized.");

    // Contract details
    const contractAddress = '0x374b897AF1c0213cc2153a761A856bd80fb91c92';
    const contractABI = [
        {"inputs":[],"stateMutability":"nonpayable","type":"constructor"},
        {"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"approved","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Approval","type":"event"},
        {"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"operator","type":"address"},{"indexed":false,"internalType":"bool","name":"approved","type":"bool"}],"name":"ApprovalForAll","type":"event"},
        {"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},
        {"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Transfer","type":"event"},
        {"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"addressMintedBalance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
        {"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"approve","outputs":[],"stateMutability":"nonpayable","type":"function"},
        {"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
        {"inputs":[],"name":"baseExtension","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},
        {"inputs":[],"name":"baseURI","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},
        {"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"getApproved","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},
        {"inputs":[],"name":"getPaid","outputs":[],"stateMutability":"payable","type":"function"},
        {"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"hasHeldToken0","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},
        {"inputs":[],"name":"hasItBegun","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},
        {"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"operator","type":"address"}],"name":"isApprovedForAll","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},
        {"inputs":[],"name":"lastTransferTimestamp","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
        {"inputs":[],"name":"maxHogDuration","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
        {"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},
        {"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},
        {"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"ownerOf","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},
        {"inputs":[],"name":"priceToRelease","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
        {"inputs":[{"internalType":"address","name":"to","type":"address"}],"name":"propagate","outputs":[],"stateMutability":"nonpayable","type":"function"},
        {"inputs":[],"name":"release","outputs":[],"stateMutability":"payable","type":"function"},
        {"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},
        {"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},
        {"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"bytes","name":"_data","type":"bytes"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},
        {"inputs":[{"internalType":"address","name":"operator","type":"address"},{"internalType":"bool","name":"approved","type":"bool"}],"name":"setApprovalForAll","outputs":[],"stateMutability":"nonpayable","type":"function"},
        {"inputs":[{"internalType":"string","name":"_newBaseExtension","type":"string"}],"name":"setBaseExtension","outputs":[],"stateMutability":"nonpayable","type":"function"},
        {"inputs":[{"internalType":"string","name":"_newBaseURI","type":"string"}],"name":"setBaseURI","outputs":[],"stateMutability":"nonpayable","type":"function"},
        {"inputs":[{"internalType":"bool","name":"yes","type":"bool"}],"name":"setBegun","outputs":[],"stateMutability":"nonpayable","type":"function"},
        {"inputs":[{"internalType":"uint256","name":"_maxHogDuration","type":"uint256"}],"name":"setMaxHogDuration","outputs":[],"stateMutability":"nonpayable","type":"function"},
        {"inputs":[{"internalType":"uint256","name":"price","type":"uint256"}],"name":"setPrice","outputs":[],"stateMutability":"nonpayable","type":"function"},
        {"inputs":[{"internalType":"bytes4","name":"interfaceId","type":"bytes4"}],"name":"supportsInterface","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},
        {"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},
        {"inputs":[],"name":"timeUntilYoinkable","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
        {"inputs":[{"internalType":"uint256","name":"index","type":"uint256"}],"name":"tokenByIndex","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
        {"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"uint256","name":"index","type":"uint256"}],"name":"tokenOfOwnerByIndex","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
        {"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"tokenURI","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},
        {"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
        {"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"transferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},
        {"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},
        {"inputs":[],"name":"yoink","outputs":[],"stateMutability":"nonpayable","type":"function"},
        {"inputs":[{"internalType":"address","name":"target","type":"address"}],"name":"yoinkTo","outputs":[],"stateMutability":"nonpayable","type":"function"},
        {"stateMutability":"payable","type":"receive"}
    ];

    // Initialize contract
    console.log("Initializing contract with address:", contractAddress);
    const contract = new ethers.Contract(contractAddress, contractABI, provider);
    console.log("Contract initialized.");

    // Token ID of interest
    const tokenId = 0;
    console.log("Token ID of interest:", tokenId);

    // Function to get the current holder of Token ID 0
    async function getCurrentHolder() {
        console.log("Fetching current holder for token ID:", tokenId);
        try {
            const holder = await contract.ownerOf(tokenId);
            console.log("Current holder fetched successfully:", holder);
            document.getElementById('currentHolder').innerText = holder;
        } catch (error) {
            console.error("Error fetching current holder:", error);
            document.getElementById('currentHolder').innerText = "Error fetching data";
        }
    }

    // Function to get past holders from Transfer events
    async function getPastHolders() {
        console.log("Fetching past holders for token ID:", tokenId);
        try {
            const filter = contract.filters.Transfer(null, null, tokenId);
            console.log("Filter for Transfer events created:", filter);
            const deploymentBlock = 1943598; // Set deployment block
            const logs = await contract.queryFilter(filter, deploymentBlock, 'latest');
            console.log("Transfer logs fetched successfully. Number of logs:", logs.length);

            let pastHolders = logs.map(log => log.args.from).filter((address, index, self) =>
                address !== ethers.constants.AddressZero && self.indexOf(address) === index
            );
            console.log("Past holders filtered successfully:", pastHolders);

            // Reverse the array to list addresses in reverse order
            pastHolders = pastHolders.reverse();

            // Populate the past holders list
            const pastHoldersList = document.getElementById('pastHolders');
            pastHoldersList.innerHTML = ''; // Clear loading text
            pastHolders.forEach((address, index) => {
                console.log("Adding past holder to list:", address);
                const listItem = document.createElement('li');
                listItem.innerText = `${pastHolders.length - index}. ${address}`;
                pastHoldersList.appendChild(listItem);
            });
        } catch (error) {
            console.error("Error fetching past holders:", error);
            document.getElementById('pastHolders').innerHTML = "<li>Error fetching data</li>";
        }
    }

    // Initialize data fetching
    console.log("Initializing data fetching...");
    getCurrentHolder();
    getPastHolders();
});