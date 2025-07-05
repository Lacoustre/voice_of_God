const sdk = require("node-appwrite");
require("dotenv").config();

const client = new sdk.Client()
  .setEndpoint(process.env.APPWRITE_ENDPOINT)
  .setProject(process.env.APPWRITE_PROJECT_ID)
  .setKey(process.env.APPWRITE_API_KEY);

const account = new sdk.Account(client);

const authenticateUser = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    client.setJWT(token);
    const user = await account.get();
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: "The current user is not authorized to perform the requested action." });
  }
};

module.exports = { authenticateUser };