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
      console.log('No token provided in request');
      return res.status(401).json({ error: "No token provided" });
    }

    console.log('Token received:', token.substring(0, 10) + '...');

    // Handle both token formats for backward compatibility
    let userId;
    
    // Try to decode base64 token first (new format)
    try {
      const decodedToken = Buffer.from(token, 'base64').toString();
      const tokenParts = decodedToken.split('-');
      if (tokenParts.length >= 2) {
        userId = tokenParts[0]; // First part is userId in new format
        console.log('Extracted userId from new token format:', userId);
      }
    } catch (decodeError) {
      console.log('Not a base64 token, trying legacy format');
    }
    
    // If userId is still not found, try legacy format
    if (!userId) {
      const tokenParts = token.split('-');
      
      if (tokenParts[0] === 'admin' && tokenParts[1] === 'token' && tokenParts.length >= 3) {
        userId = tokenParts[2];
        console.log('Extracted userId from legacy token format:', userId);
      } else {
        // Try to find a valid UUID format in the token parts
        userId = tokenParts.find(part => 
          /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(part) || 
          /^[0-9a-f]{32}$/i.test(part)
        );
      }
    }
    
    if (!userId) {
      console.log('Could not extract userId from token');
      return res.status(401).json({ error: "Invalid token format" });
    }
    
    // Get the user from the database
    try {
      const user = await databases.getDocument(
        process.env.APPWRITE_DATABASE_ID,
        '6857e27c003209cdf7ef', // Admins collection ID
        userId
      );
      
      console.log('User found in database:', user.$id);
      req.user = { 
        $id: user.$id,
        email: user.email,
        name: user.name,
        role: user.role || 'admin'
      };
      next();
    } catch (dbError) {
      console.error('Error fetching user from database:', dbError);
      return res.status(401).json({ error: "User not found or invalid token" });
    }
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(401).json({ error: "Authentication failed" });
  }
};

module.exports = { authenticateUser };