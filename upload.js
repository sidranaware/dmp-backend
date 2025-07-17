require("dotenv").config();
const { JsonRpcProvider, Wallet, Contract } = require("ethers");
const fs = require("fs");

const RPC_URL = process.env.RPC_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;

const ABI = require("./abi.json");

const provider = new JsonRpcProvider(RPC_URL);
const wallet = new Wallet(PRIVATE_KEY, provider);
const contract = new Contract(CONTRACT_ADDRESS, ABI, wallet);

// Load Revit JSON data
const materialData = require("./yourData.json");

async function uploadPassports() {
    for (let item of materialData) {
        try {
            const elementID = parseInt(item["Element ID"]);
            const passport = {
                elementType: item["Type"] || "",
                volume: item["Volume"] || "",
                origin: item["Material Origin (mill/supplier)"] || "",
                embodiedCarbon: item["Embodied Carbon (kgCO₂e/kg)"] || "",
                lifespan: item["Estimated Lifespan (years)"] || "",
                fireRating: item["Fire Rating / Coating"] || "",
                installDate: item["Installation Date"] || "",
                manufacturer: item["Manufacturer"] || "",
                recycledContent: item["Recycled Content (%)"] || "",
                weight: item["Weight"] || "",
                exchangeID: item["Exchange ID"] || ""
            };

            const tx = await contract.createPassport(elementID, passport);
            console.log(`✅ Uploaded Element ID ${elementID} | Tx: ${tx.hash}`);
            await tx.wait();
        } catch (err) {
            console.error(`❌ Failed Element ID ${item["Element ID"]}: ${err.message}`);
        }
    }
}

uploadPassports();