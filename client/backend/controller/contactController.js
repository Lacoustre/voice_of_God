const sdk = require("node-appwrite");
require("dotenv").config();

const client = new sdk.Client()
  .setEndpoint(process.env.APPWRITE_ENDPOINT)
  .setProject(process.env.APPWRITE_PROJECT_ID)
  .setKey(process.env.APPWRITE_API_KEY);

const databases = new sdk.Databases(client);

const DATABASE_ID = process.env.APPWRITE_DATABASE_ID;
const COLLECTION_ID = "686158d00005863e7d47";

exports.getContacts = async (req, res) => {
  try {
    const result = await databases.listDocuments(DATABASE_ID, COLLECTION_ID);
    res.status(200).json({ success: true, contacts: result.documents });
  } catch (error) {
    console.error("Error fetching contacts:", error.message);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.createContact = async (req, res) => {
  const { email, phone, message } = req.body;

  if (!email || !message) {
    return res.status(400).json({ success: false, error: "Email and message are required" });
  }

  try {
    const result = await databases.createDocument(
      DATABASE_ID,
      COLLECTION_ID,
      sdk.ID.unique(),
      {
        email,
        phone: phone || "",
        message,
        read: false
      }
    );

    res.status(201).json({ success: true, contact: result });
  } catch (error) {
    console.error("Error creating contact:", error.message);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.deleteContact = async (req, res) => {
  const { id } = req.params;

  try {
    await databases.deleteDocument(DATABASE_ID, COLLECTION_ID, id);
    res.status(200).json({ success: true, message: "Contact deleted successfully" });
  } catch (error) {
    console.error("Error deleting contact:", error.message);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.updateContact = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  try {
    const result = await databases.updateDocument(
      DATABASE_ID,
      COLLECTION_ID,
      id,
      updateData
    );
    res.status(200).json({ success: true, contact: result });
  } catch (error) {
    console.error("Error updating contact:", error.message);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Legacy function for existing route
exports.handleContact = exports.createContact;

exports.sendReply = async (req, res) => {
  const { to, message, originalMessage } = req.body;
  
  if (!to || !message) {
    return res.status(400).json({ success: false, error: "Email and message are required" });
  }

  try {
    const emailService = require('../emailService');
    
    console.log(`Sending reply email to: ${to}`);
    
    const emailResult = await emailService.sendEmail({
      to: to,
      subject: 'Reply from Voice of God Ministries',
      message: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <img src="https://i.imgur.com/placeholder-logo.png" alt="Voice of God Ministries" style="max-width: 120px; height: auto;" />
            <h2 style="color: #4F46E5; margin-top: 15px;">Voice of God Ministries</h2>
          </div>
          
          <p style="color: #333; font-size: 16px;">Thank you for contacting us. Here is our reply:</p>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #4F46E5;">
            ${message.replace(/\n/g, '<br>')}
          </div>
          
          ${originalMessage ? `
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
            <p style="color: #666; font-size: 14px; margin-bottom: 10px;"><strong>Your original message:</strong></p>
            <div style="background-color: #f9f9f9; padding: 15px; border-radius: 6px; color: #555; font-style: italic;">
              ${originalMessage.replace(/\n/g, '<br>')}
            </div>
          </div>
          ` : ''}
          
          <div style="margin-top: 30px; text-align: center;">
            <p style="color: #333; font-size: 16px;">Blessings,<br><strong>Voice of God Ministries Team</strong></p>
            <hr style="margin: 20px 0; border: none; border-top: 1px solid #e0e0e0;">
            <p style="font-size: 12px; color: #666;">52 Connecticut Avenue, South Windsor, CT 06074</p>
          </div>
        </div>
      `
    });
    
    console.log('Email sent successfully:', emailResult);
    res.status(200).json({ success: true, message: "Reply sent successfully" });
  } catch (error) {
    console.error("Error sending reply email:", error);
    res.status(500).json({ success: false, error: `Failed to send email: ${error.message}` });
  }
};