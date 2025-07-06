require("dotenv").config();
const sdk = require("node-appwrite");

const client = new sdk.Client()
  .setEndpoint(process.env.APPWRITE_ENDPOINT)
  .setProject(process.env.APPWRITE_PROJECT_ID)
  .setKey(process.env.APPWRITE_API_KEY);

const databases = new sdk.Databases(client);

exports.getEvents = async (req, res) => {
  try {
    const response = await databases.listDocuments(
      process.env.APPWRITE_DATABASE_ID,
      process.env.EVENTS_COLLECTION_ID
    );

    res.status(200).json({ success: true, events: response.documents });
  } catch (error) {
    console.error("Get Events Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};


exports.createEvent = async (req, res) => {
  const { title, date, time, verse, location, images, additionalInfo } = req.body;

  if (!title || !date || !time || !location || !additionalInfo) {
    return res.status(400).json({ success: false, error: "Missing required fields" });
  }

  try {
    const event = await databases.createDocument(
      process.env.APPWRITE_DATABASE_ID,
      process.env.EVENTS_COLLECTION_ID,
      sdk.ID.unique(),
      {
        title,
        date,
        time,
        verse,
        location,
        images: images || [],
        additionalInfo,
      }
    );

    res.status(201).json({ success: true, event }); 
  } catch (error) {
    console.error("Create Event Error:", error);
    res.status(500).json({ success: false, error: error.message }); 
  }
};


exports.updateEvent = async (req, res) => {
  const { id } = req.params;
  const { title, date, time, verse, location, images, additionalInfo } = req.body;

  try {
    const updated = await databases.updateDocument(
      process.env.APPWRITE_DATABASE_ID,
      process.env.EVENTS_COLLECTION_ID,
      id,
      {
        title,
        date,
        time,
        verse,
        location,
        images,
        additionalInfo,
      }
    );
    res.status(200).json(updated);
  } catch (error) {
    console.error("Update Event Error:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.deleteEvent = async (req, res) => {
  const { id } = req.params;

  try {
    await databases.deleteDocument(
      process.env.APPWRITE_DATABASE_ID,
      process.env.EVENTS_COLLECTION_ID,
      id
    );
    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Delete Event Error:", error);
    res.status(500).json({ error: error.message });
  }
};

