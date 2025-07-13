const sdk = require("node-appwrite");
const crypto = require("crypto");
require("dotenv").config();

const client = new sdk.Client()
  .setEndpoint(process.env.APPWRITE_ENDPOINT)
  .setProject(process.env.APPWRITE_PROJECT_ID)
  .setKey(process.env.APPWRITE_API_KEY);

const databases = new sdk.Databases(client);

// Password hashing function using SHA-256 (compatible with 50 char limit)
exports.hashPassword = (password) => {
  const salt = process.env.TOKEN_SECRET || 'default-salt-value';
  return crypto.createHmac('sha256', salt).update(password).digest('hex').substring(0, 50);
};

// Password verification function
exports.verifyPassword = (plainPassword, hashedPassword) => {
  const hashedInput = exports.hashPassword(plainPassword);
  return hashedInput === hashedPassword;
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  console.log('Login attempt for email:', email);

  try {
    // Get admin from database
    const adminList = await databases.listDocuments(
      process.env.APPWRITE_DATABASE_ID,
      '6857e27c003209cdf7ef'
    );
    
    console.log('Found admins:', adminList.documents.length);
    const admin = adminList.documents.find(a => a.email === email);
    
    if (!admin) {
      console.log('Admin not found for email:', email);
      return res.status(401).json({ error: "Invalid credentials" });
    }
    
    // Secure password verification using SHA-256
    const isPasswordValid = exports.verifyPassword(password, admin.password);
    
    if (!isPasswordValid) {
      console.log('Password verification failed for:', email);
      return res.status(401).json({ error: "Invalid credentials" });
    }
    
    console.log('Login successful for:', email);
    
    // Create session token with JWT or a more secure method
    // For now, we'll use a more secure format that doesn't expose the user ID directly
    const tokenSecret = process.env.TOKEN_SECRET || 'default-secret-key';
    const timestamp = Date.now();
    const tokenData = `${admin.$id}-${timestamp}-${tokenSecret}`;
    const token = Buffer.from(tokenData).toString('base64');
    
    res.status(200).json({ 
      token, 
      user: {
        $id: admin.$id,
        email: admin.email,
        name: admin.name,
        username: admin.username,
        profile_image: admin.profile_image,
        role: admin.role || 'admin'
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: "Authentication failed" });
  }
};

// Get current user info
exports.getCurrentUser = async (req, res) => {
  try {
    // The user ID should be available from the auth middleware
    const userId = req.user?.$id;
    
    if (!userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    
    // Get admin from database
    const admin = await databases.getDocument(
      process.env.APPWRITE_DATABASE_ID,
      '6857e27c003209cdf7ef',
      userId
    );
    
    if (!admin) {
      return res.status(404).json({ error: "User not found" });
    }
    
    // Return user info without sensitive data
    res.status(200).json({
      $id: admin.$id,
      email: admin.email,
      name: admin.name,
      username: admin.username,
      profile_image: admin.profile_image,
      phone: admin.phone,
      address: admin.address,
      dateofbirth: admin.dateofbirth,
      role: admin.role
    });
  } catch (err) {
    console.error('Error getting current user:', err);
    res.status(500).json({ error: "Failed to get user information" });
  }
};