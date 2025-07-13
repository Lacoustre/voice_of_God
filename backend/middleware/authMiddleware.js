const sdk = require("node-appwrite");
require("dotenv").config();

const client = new sdk.Client()
  .setEndpoint(process.env.APPWRITE_ENDPOINT)
  .setProject(process.env.APPWRITE_PROJECT_ID)
  .setKey(process.env.APPWRITE_API_KEY);

const account = new sdk.Account(client);
const databases = new sdk.Databases(client);

const authenticateUser = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    // For our custom token system, extract the user ID from the token
    // Format: 'admin-token-{userId}-{timestamp}'
    const tokenParts = token.split('-');
    if (tokenParts.length < 3 || tokenParts[0] !== 'admin' || tokenParts[1] !== 'token') {
      return res.status(401).json({ error: "Invalid token format" });
    }

    const userId = tokenParts[2];
    
    // Get the user from the database
    try {
      const user = await databases.getDocument(
        process.env.APPWRITE_DATABASE_ID,
        '6857e27c003209cdf7ef', // Admins collection ID
        userId
      );
      
      req.user = { $id: user.$id };
      next();
    } catch (dbError) {
      console.error('Error fetching user from database:', dbError);
      return res.status(401).json({ error: "User not found" });
    }
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(401).json({ error: "The current user is not authorized to perform the requested action." });
  }
};

module.exports = { authenticateUser };