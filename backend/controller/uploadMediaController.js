const sdk = require("node-appwrite");
const multer = require('multer');
const { InputFile } = require('node-appwrite/file');

const client = new sdk.Client()
  .setEndpoint(process.env.APPWRITE_ENDPOINT)
  .setProject(process.env.APPWRITE_PROJECT_ID)
  .setKey(process.env.APPWRITE_API_KEY);

const databases = new sdk.Databases(client);
const storage = new sdk.Storage(client);

const upload = multer({ storage: multer.memoryStorage() });

exports.uploadMedia = async (req, res) => {
  const { image_url, uploaded_by, published = false, target } = req.body;

  const COLLECTION_ID =
    target === "top"
      ? process.env.TOP_CAROUSEL_COLLECTION_ID
      : process.env.DONATION_CAROUSEL_COLLECTION_ID;

  try {
    await databases.createDocument(
      process.env.APPWRITE_DATABASE_ID,
      COLLECTION_ID,
      sdk.ID.unique(),
      {
        image_url,
        uploaded_by,
        published: published || false,
      }
    );

    res.status(200).json({ message: "Media uploaded successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to upload media" });
  }
};

exports.getMedia = async (req, res) => {
  try {
    const [topMedia, donationMedia] = await Promise.all([
      databases.listDocuments(
        process.env.APPWRITE_DATABASE_ID,
        process.env.TOP_CAROUSEL_COLLECTION_ID
      ),
      databases.listDocuments(
        process.env.APPWRITE_DATABASE_ID,
        process.env.DONATION_CAROUSEL_COLLECTION_ID
      )
    ]);

    res.status(200).json({
      top: topMedia.documents,
      donation: donationMedia.documents
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch media" });
  }
};

exports.updateMedia = async (req, res) => {
  const { id, target, published } = req.body;
  const COLLECTION_ID = target === "top" 
    ? process.env.TOP_CAROUSEL_COLLECTION_ID 
    : process.env.DONATION_CAROUSEL_COLLECTION_ID;

  try {
    await databases.updateDocument(
      process.env.APPWRITE_DATABASE_ID,
      COLLECTION_ID,
      id,
      { published: published }
    );
    res.status(200).json({ message: "Media updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update media" });
  }
};

exports.deleteMedia = async (req, res) => {
  const { id, target } = req.body;
  const COLLECTION_ID = target === "top" 
    ? process.env.TOP_CAROUSEL_COLLECTION_ID 
    : process.env.DONATION_CAROUSEL_COLLECTION_ID;

  try {
    await databases.deleteDocument(
      process.env.APPWRITE_DATABASE_ID,
      COLLECTION_ID,
      id
    );
    res.status(200).json({ message: "Media deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete media" });
  }
};

exports.uploadFile = [upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: 'No file provided' });
    }

    const uploaded = await storage.createFile(
      process.env.APPWRITE_BUCKET_ID,
      sdk.ID.unique(),
      InputFile.fromBuffer(file.buffer, file.originalname)
    );

    const imageUrl = `${process.env.APPWRITE_ENDPOINT}/storage/buckets/${process.env.APPWRITE_BUCKET_ID}/files/${uploaded.$id}/view?project=${process.env.APPWRITE_PROJECT_ID}`;
    
    res.status(200).json({ 
      success: true, 
      url: imageUrl, 
      fileId: uploaded.$id 
    });
  } catch (err) {
    console.error('File upload error:', err);
    res.status(500).json({ error: 'Failed to upload file' });
  }
}];
