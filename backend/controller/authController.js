const sdk = require("node-appwrite");
require("dotenv").config();

const client = new sdk.Client()
  .setEndpoint(process.env.APPWRITE_ENDPOINT)
  .setProject(process.env.APPWRITE_PROJECT_ID)
  .setKey(process.env.APPWRITE_API_KEY);

const databases = new sdk.Databases(client);

exports.login = async (req, res) => {
  const { email, password } = req.body;
  console.log('Login attempt:', { email, password });

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
    
    console.log('Admin found:', { email: admin.email, storedPassword: admin.password });
    
    // Simple plain text password comparison
    if (password !== admin.password) {
      console.log('Password mismatch:', { entered: password, stored: admin.password });
      return res.status(401).json({ error: "Invalid credentials" });
    }
    
    console.log('Login successful');
    
    // Create session token (simplified)
    const token = 'admin-token-' + admin.$id + '-' + Date.now();
    
    res.status(200).json({ 
      token, 
      user: {
        $id: admin.$id,
        email: admin.email,
        name: admin.name,
        role: admin.role
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(401).json({ error: "Invalid credentials" });
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