const sdk = require("node-appwrite");
const crypto = require("crypto");
const emailService = require("../emailService");
require("dotenv").config();

const client = new sdk.Client()
  .setEndpoint(process.env.APPWRITE_ENDPOINT)
  .setProject(process.env.APPWRITE_PROJECT_ID)
  .setKey(process.env.APPWRITE_API_KEY);

const databases = new sdk.Databases(client);
const RESET_CODES = {}; // In-memory storage for reset codes

// Generate a random 6-digit code
const generateResetCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Hash password (same as in authController)
const hashPassword = (password) => {
  const salt = process.env.TOKEN_SECRET || 'default-salt-value';
  return crypto.createHmac('sha256', salt).update(password).digest('hex').substring(0, 50);
};

// Request password reset
exports.requestReset = async (req, res) => {
  const { email } = req.body;
  
  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  try {
    // Find admin with this email
    const adminList = await databases.listDocuments(
      process.env.APPWRITE_DATABASE_ID,
      '6857e27c003209cdf7ef'
    );
    
    const admin = adminList.documents.find(a => a.email === email);
    
    if (!admin) {
      // Return error if email doesn't exist
      return res.status(404).json({ 
        success: false, 
        error: "No account found with this email address" 
      });
    }
    
    // Generate a reset code
    const resetCode = generateResetCode();
    
    // Store the code with expiration (10 minutes)
    RESET_CODES[email] = {
      code: resetCode,
      userId: admin.$id,
      expires: Date.now() + 10 * 60 * 1000 // 10 minutes
    };
    
    // Send email with reset code
    await emailService.sendEmail({
      to: email,
      subject: "Password Reset Code - Voice of God Admin",
      message: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #5b21b6;">Voice of God Admin - Password Reset</h2>
          <p>You requested a password reset. Please use the following code to reset your password:</p>
          <div style="background-color: #f3f4f6; padding: 15px; border-radius: 5px; text-align: center; margin: 20px 0;">
            <h1 style="font-size: 32px; letter-spacing: 5px; color: #5b21b6;">${resetCode}</h1>
          </div>
          <p>This code will expire in 10 minutes.</p>
          <p>If you didn't request this reset, please ignore this email.</p>
          <p>Thank you,<br>Voice of God Ministries</p>
        </div>
      `
    });
    
    return res.status(200).json({ 
      success: true, 
      message: "Reset code sent to your email" 
    });
  } catch (error) {
    console.error("Password reset request error:", error);
    return res.status(500).json({ error: "Failed to process password reset request" });
  }
};

// Verify reset code and set new password
exports.resetPassword = async (req, res) => {
  const { email, code, newPassword } = req.body;
  
  if (!email || !code || !newPassword) {
    return res.status(400).json({ error: "Email, code and new password are required" });
  }
  
  try {
    // Check if reset code exists and is valid
    const resetData = RESET_CODES[email];
    
    if (!resetData || resetData.code !== code || Date.now() > resetData.expires) {
      return res.status(400).json({ error: "Invalid or expired reset code" });
    }
    
    // Update password in database
    await databases.updateDocument(
      process.env.APPWRITE_DATABASE_ID,
      '6857e27c003209cdf7ef',
      resetData.userId,
      { password: hashPassword(newPassword) }
    );
    
    // Remove the used reset code
    delete RESET_CODES[email];
    
    return res.status(200).json({ 
      success: true, 
      message: "Password has been reset successfully" 
    });
  } catch (error) {
    console.error("Password reset error:", error);
    return res.status(500).json({ error: "Failed to reset password" });
  }
};