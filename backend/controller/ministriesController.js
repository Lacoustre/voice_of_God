const sdk = require("node-appwrite");
require("dotenv").config();

// Check if required environment variables are defined
if (!process.env.APPWRITE_ENDPOINT) {
  console.error("Error: APPWRITE_ENDPOINT is not defined in .env file");
  process.env.APPWRITE_ENDPOINT = "https://cloud.appwrite.io/v1"; // Default fallback
}

const client = new sdk.Client();

// Set endpoint with error handling
try {
  client.setEndpoint(process.env.APPWRITE_ENDPOINT);
  client.setProject(process.env.APPWRITE_PROJECT_ID || "");
  client.setKey(process.env.APPWRITE_API_KEY || "");
} catch (error) {
  console.error("Error initializing Appwrite client:", error);
}

const databases = new sdk.Databases(client);

const DATABASE_ID = process.env.APPWRITE_DATABASE_ID || "";
const MINISTRIES_COLLECTION_ID = "ministries"; // Update this with your actual collection ID

// Default ministries data for fallback
const defaultMinistries = [
  {
    id: "1",
    title: "Women's Ministry",
    description: "Our Women's Ministry provides a supportive community where women can grow in their faith, develop meaningful relationships, and serve others.",
    imageUrl: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?ixlib=rb-4.0.3",
    activities: [
      { title: "Bible Study Groups", description: "Weekly gatherings for spiritual growth and fellowship" },
      { title: "Prayer Circles", description: "Supporting one another through prayer and encouragement" },
      { title: "Outreach Programs", description: "Serving the community through various initiatives" }
    ],
    order: 1
  },
  {
    id: "2",
    title: "Men's Ministry",
    description: "Our Men's Ministry is dedicated to helping men grow in their relationship with God and become spiritual leaders in their homes, church, and community.",
    imageUrl: "https://images.unsplash.com/photo-1511988617509-a57c8a288659?ixlib=rb-4.0.3",
    activities: [
      { title: "Brotherhood Meetings", description: "Monthly gatherings for fellowship and spiritual growth" },
      { title: "Mentorship Program", description: "Pairing experienced men with younger men for guidance" },
      { title: "Service Projects", description: "Using skills and strength to serve the church and community" }
    ],
    order: 2
  }
];

// Get all ministries
exports.getMinistries = async (req, res) => {
  try {
    // Try to get ministries from database
    const result = await databases.listDocuments(DATABASE_ID, MINISTRIES_COLLECTION_ID);
    
    // If no ministries found, return default ones
    if (result.documents.length === 0) {
      return res.status(200).json({ success: true, ministries: defaultMinistries });
    }
    
    res.status(200).json({ success: true, ministries: result.documents });
  } catch (error) {
    console.error("Error fetching ministries:", error.message);
    // Return default ministries on error
    res.status(200).json({ success: true, ministries: defaultMinistries });
  }
};

// Create a new ministry
exports.createMinistry = async (req, res) => {
  try {
    const { title, description, imageUrl, activities, order } = req.body;
    
    if (!title || !description) {
      return res.status(400).json({ success: false, message: "Title and description are required" });
    }
    
    const result = await databases.createDocument(
      DATABASE_ID,
      MINISTRIES_COLLECTION_ID,
      sdk.ID.unique(),
      {
        title,
        description,
        imageUrl: imageUrl || "",
        activities: activities || [],
        order: order || 0
      }
    );
    
    res.status(201).json({ success: true, ministry: result });
  } catch (error) {
    console.error("Error creating ministry:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update a ministry
exports.updateMinistry = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const result = await databases.updateDocument(
      DATABASE_ID,
      MINISTRIES_COLLECTION_ID,
      id,
      updateData
    );
    
    res.status(200).json({ success: true, ministry: result });
  } catch (error) {
    console.error("Error updating ministry:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete a ministry
exports.deleteMinistry = async (req, res) => {
  try {
    const { id } = req.params;
    
    await databases.deleteDocument(DATABASE_ID, MINISTRIES_COLLECTION_ID, id);
    
    res.status(200).json({ success: true, message: "Ministry deleted successfully" });
  } catch (error) {
    console.error("Error deleting ministry:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};