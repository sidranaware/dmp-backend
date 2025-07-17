require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { JsonRpcProvider, Contract } = require("ethers");
const ABI = require("./abi.json");

const app = express();
app.use(cors());
const provider = new JsonRpcProvider(process.env.RPC_URL);
const contract = new Contract(process.env.CONTRACT_ADDRESS, ABI, provider);

app.get("/passport", async (req, res) => {
    const id = req.query.id;
    try {
        const dmp = await contract.getPassport(id);
        res.json([{
            "Element ID": id,
            "Type": dmp[0],
            "Volume": dmp[1],
            "Material Origin": dmp[2],
            "Embodied Carbon": dmp[3],
            "Lifespan": dmp[4],
            "Fire Rating": dmp[5],
            "Installation Date": dmp[6],
            "Manufacturer": dmp[7],
            "Recycled Content": dmp[8],
            "Weight": dmp[9],
            "Exchange ID": dmp[10],
            "Owner": dmp[11]
        }]);
    } catch (err) {
        res.status(500).json({ error: "Error fetching DMP", details: err.message });
    }
});

app.listen(3000, () => console.log("✅ API Server running at http://localhost:3000"));