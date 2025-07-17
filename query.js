require("dotenv").config();
const { JsonRpcProvider, Contract } = require("ethers");
const fs = require("fs");
const ABI = require("./abi.json");

const provider = new JsonRpcProvider(process.env.RPC_URL);
const contract = new Contract(process.env.CONTRACT_ADDRESS, ABI, provider);

// Use command line argument or fallback
const ELEMENT_ID = process.argv[2] || 578014;

async function fetchPassport() {
    try {
        const data = await contract.getPassport(ELEMENT_ID);

        const formatted = {
            "Element ID": ELEMENT_ID,
            "Type": data[0],
            "Volume": data[1],
            "Material Origin": data[2],
            "Embodied Carbon": data[3],
            "Lifespan": data[4],
            "Fire Rating": data[5],
            "Installation Date": data[6],
            "Manufacturer": data[7],
            "Recycled Content": data[8],
            "Weight": data[9],
            "Exchange ID": data[10],
            "Owner": data[11]
        };

        fs.writeFileSync("elementData.json", JSON.stringify([formatted], null, 2));
        console.log(`✅ DMP for Element ID ${ELEMENT_ID} saved to elementData.json`);
    } catch (err) {
        console.error("❌ Error fetching data:", err);
    }
}

fetchPassport();