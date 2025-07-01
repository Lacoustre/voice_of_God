const sdk = require("node-appwrite");

const client = new sdk.Client()
  .setEndpoint(process.env.APPWRITE_ENDPOINT)
  .setProject(process.env.APPWRITE_PROJECT_ID)
  .setKey(process.env.APPWRITE_API_KEY);

const databases = new sdk.Databases(client);

exports.createAnnouncement = async (req, res) => {
  const { title, content, target_groups, post_on_website } = req.body;

  try {
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
    res.status(201).json({ message: "Announcement created successfully", data: result });
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
    res.status(200).json({ data: result.documents });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch announcements" });
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