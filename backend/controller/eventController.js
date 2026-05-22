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

  console.log('Received date from frontend:', date);
  console.log('Date type:', typeof date);

  if (!title || !date || !time || !location || !additionalInfo) {
    return res.status(400).json({ success: false, error: "Missing required fields" });
  }

  try {
    // Ensure date is in YYYY-MM-DD format string
    let formattedDate = date;
    
    // If date is a Date object or timestamp, convert to YYYY-MM-DD
    if (date instanceof Date || !isNaN(Date.parse(date))) {
      const d = new Date(date);
      // Get date in local timezone as YYYY-MM-DD
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      formattedDate = `${year}-${month}-${day}`;
    }
    
    // If it's already in YYYY-MM-DD format, keep it as is
    if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      formattedDate = date;
    }

    const eventData = {
      title,
      date: formattedDate, // Store as YYYY-MM-DD string
      time,
      verse,
      location,
      images: images || [],
      additionalInfo,
    };

    console.log('Storing event data with formatted date:', eventData);

    const event = await databases.createDocument(
      process.env.APPWRITE_DATABASE_ID,
      process.env.EVENTS_COLLECTION_ID,
      sdk.ID.unique(),
      eventData
    );

    console.log('Stored event:', event);

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
    // Ensure date is in YYYY-MM-DD format string
    let formattedDate = date;
    
    if (date) {
      // If date is a Date object or timestamp, convert to YYYY-MM-DD
      if (date instanceof Date || !isNaN(Date.parse(date))) {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        formattedDate = `${year}-${month}-${day}`;
      }
      
      // If it's already in YYYY-MM-DD format, keep it as is
      if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        formattedDate = date;
      }
    }

    const updated = await databases.updateDocument(
      process.env.APPWRITE_DATABASE_ID,
      process.env.EVENTS_COLLECTION_ID,
      id,
      {
        title,
        date: formattedDate,
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

