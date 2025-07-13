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

  // Validate required fields
  if (!image_url) {
    return res.status(400).json({ error: "Missing required field: image_url" });
  }
  
  if (!target) {
    return res.status(400).json({ error: "Missing required field: target" });
  }

  const COLLECTION_ID =
    target === "top"
      ? process.env.TOP_CAROUSEL_COLLECTION_ID
      : process.env.DONATION_CAROUSEL_COLLECTION_ID;

  if (!COLLECTION_ID) {
    return res.status(400).json({ error: `Invalid target: ${target}` });
  }

  try {
    console.log(`Creating media document in collection ${COLLECTION_ID}`);
    console.log(`Data: image_url=${image_url}, uploaded_by=${uploaded_by || 'unknown'}, published=${published}`);
    
    const result = await databases.createDocument(
      process.env.APPWRITE_DATABASE_ID,
      COLLECTION_ID,
      sdk.ID.unique(),
      {
        image_url,
        uploaded_by: uploaded_by || 'system',
        published: published || false,
      }
    );

    console.log('Media document created successfully:', result.$id);
    res.status(200).json({ message: "Media uploaded successfully", id: result.$id });
  } catch (err) {
    console.error('Error creating media document:', err);
    res.status(500).json({ error: "Failed to upload media: " + err.message });
  }
};

exports.getMedia = async (req, res) => {
  try {
    // Check if the request is from admin panel (includes auth token)
    const isAdmin = req.headers.authorization ? true : false;
    const publishedOnly = req.query.publishedOnly === 'true' || !isAdmin;
    
    console.log(`Fetching media - Admin: ${isAdmin}, Published only: ${publishedOnly}`);
    
    // For admin panel without publishedOnly flag, get all media items
    // For client-side or with publishedOnly flag, only get published items
    const [topMedia, donationMedia] = await Promise.all([
      databases.listDocuments(
        process.env.APPWRITE_DATABASE_ID,
        process.env.TOP_CAROUSEL_COLLECTION_ID,
        publishedOnly ? [sdk.Query.equal('published', true)] : []
      ),
      databases.listDocuments(
        process.env.APPWRITE_DATABASE_ID,
        process.env.DONATION_CAROUSEL_COLLECTION_ID,
        publishedOnly ? [sdk.Query.equal('published', true)] : []
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
