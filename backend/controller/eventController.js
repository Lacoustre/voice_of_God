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

    console.log('Raw events from Appwrite:', JSON.stringify(response.documents[0], null, 2));

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
    // Convert date to ISO string with local timezone at noon to avoid timezone issues
    // This ensures the date stays the same regardless of timezone
    let isoDate;
    
    if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      // Date is in YYYY-MM-DD format, convert to ISO with time at noon UTC
      isoDate = `${date}T12:00:00.000Z`;
    } else {
      // Fallback: try to parse and format
      const d = new Date(date);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      isoDate = `${year}-${month}-${day}T12:00:00.000Z`;
    }

    const eventData = {
      title,
      date: isoDate, // Store as ISO string with noon UTC time
      time,
      verse,
      location,
      images: images || [],
      additionalInfo,
    };

    console.log('Storing event data with ISO date:', eventData);

    const event = await databases.createDocument(
      process.env.APPWRITE_DATABASE_ID,
      process.env.EVENTS_COLLECTION_ID,
      sdk.ID.unique(),
      eventData
    );

    console.log('Event returned from Appwrite:', JSON.stringify(event, null, 2));
    console.log('Date field in response:', event.date);
    console.log('Date field type:', typeof event.date);

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
    // Convert date to ISO string with noon UTC time
    let isoDate = date;
    
    if (date) {
      if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        isoDate = `${date}T12:00:00.000Z`;
      } else if (date instanceof Date || !isNaN(Date.parse(date))) {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        isoDate = `${year}-${month}-${day}T12:00:00.000Z`;
      }
    }

    const updated = await databases.updateDocument(
      process.env.APPWRITE_DATABASE_ID,
      process.env.EVENTS_COLLECTION_ID,
      id,
      {
        title,
        date: isoDate,
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

