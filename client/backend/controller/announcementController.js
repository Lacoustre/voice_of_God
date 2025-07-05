const sdk = require("node-appwrite");
const { sendPhoneMessages } = require('../phoneService');

const client = new sdk.Client()
  .setEndpoint(process.env.APPWRITE_ENDPOINT)
  .setProject(process.env.APPWRITE_PROJECT_ID)
  .setKey(process.env.APPWRITE_API_KEY);

const databases = new sdk.Databases(client);

exports.createAnnouncement = async (req, res) => {
  const { title, content, target_groups, post_on_website } = req.body;

  try {
    // Create announcement in database
    const result = await databases.createDocument(
      process.env.APPWRITE_DATABASE_ID,
      "685f866a000299b57437",
      sdk.ID.unique(),
      { 
        title, 
        content, 
        target_groups, 
        post_on_website: post_on_website || false 
      }
    );

    // Send phone messages to target groups (async, don't wait)
    if (target_groups && target_groups.toLowerCase() !== 'website') {
      sendPhoneMessages(title, content, target_groups)
        .then(phoneResult => {
          console.log('Phone messaging result:', phoneResult);
        })
        .catch(phoneError => {
          console.error('Phone messaging error:', phoneError);
        });
    }

    res.status(201).json({ 
      message: "Announcement created successfully", 
      data: result,
      phoneMessage: target_groups && target_groups.toLowerCase() !== 'website' 
        ? "Phone messages are being sent to target groups" 
        : "No phone messages sent (website only or no target groups)"
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create announcement" });
  }
};

exports.getAnnouncements = async (req, res) => {
  try {
    const result = await databases.listDocuments(
      process.env.APPWRITE_DATABASE_ID,
      "685f866a000299b57437"
    );
    res.status(200).json({ success: true, data: result.documents });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Failed to fetch announcements" });
  }
};

exports.updateAnnouncement = async (req, res) => {
  const { id } = req.params;
  const { title, content, category } = req.body;

  try {
    const result = await databases.updateDocument(
      process.env.APPWRITE_DATABASE_ID,
      "685f866a000299b57437",
      id,
      { 
        title, 
        content, 
        target_groups: Array.isArray(category) ? category.join(',') : category
      }
    );
    res.status(200).json({ message: "Announcement updated successfully", data: result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update announcement" });
  }
};

exports.deleteAnnouncement = async (req, res) => {
  const { id } = req.params;

  try {
    await databases.deleteDocument(
      process.env.APPWRITE_DATABASE_ID,
      "685f866a000299b57437",
      id
    );
    res.status(200).json({ message: "Announcement deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete announcement" });
  }
};

exports.sendPhoneAnnouncement = async (req, res) => {
  const { id } = req.params;
  const { target_groups } = req.body;

  try {
    // Get the announcement
    const announcement = await databases.getDocument(
      process.env.APPWRITE_DATABASE_ID,
      "685f866a000299b57437",
      id
    );

    if (!announcement) {
      return res.status(404).json({ error: "Announcement not found" });
    }

    // Use provided target_groups or fall back to announcement's target_groups
    const groupsToTarget = target_groups || announcement.target_groups;

    if (!groupsToTarget || groupsToTarget.toLowerCase() === 'website') {
      return res.status(400).json({ 
        error: "No valid target groups specified for phone messaging" 
      });
    }

    // Send phone messages
    const phoneResult = await sendPhoneMessages(
      announcement.title, 
      announcement.content, 
      groupsToTarget
    );

    res.status(200).json({
      message: phoneResult.sent > 0 ? "Phone messages sent successfully" : "No messages sent",
      result: phoneResult
    });
  } catch (err) {
    console.error('Error sending phone announcement:', err);
    res.status(500).json({ error: "Failed to send phone announcement" });
  }
};