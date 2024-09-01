require("dotenv").config();

const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:3001";
const PORT = process.env.PORT || 3001;

// const API_BASE_URL = process.env.API_BASE_URL || "https://bill.soulself.in";
// const PORT = process.env.PORT || "https://bill.soulself.in";

module.exports = { API_BASE_URL, PORT };
