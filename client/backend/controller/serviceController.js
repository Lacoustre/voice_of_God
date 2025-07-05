const sdk = require("node-appwrite");
const multer = require('multer');
const { InputFile } = require('node-appwrite/file');

const client = new sdk.Client()
  .setEndpoint(process.env.APPWRITE_ENDPOINT)
  .setProject(process.env.APPWRITE_PROJECT_ID)
  .setKey(process.env.APPWRITE_API_KEY);

const databases = new sdk.Databases(client);
const storage = new sdk.Storage(client);

const SERVICES_COLLECTION_ID = "685f8c03000207695b53";

const upload = multer({ storage: multer.memoryStorage() });

exports.createService = async (req, res) => {
  const { title, description, verse, image, schedule } = req.body;

  try {
    const service = await databases.createDocument(
      process.env.APPWRITE_DATABASE_ID,
      SERVICES_COLLECTION_ID,
      sdk.ID.unique(),
      {
        title,
        description,
        verse: verse || "",
        image,
        schedule: schedule || []
      }
    );

    res.status(201).json({ success: true, service });
  } catch (error) {
    console.error('Error creating service:', error);
    res.status(500).json({ error: "Failed to create service" });
  }
};

exports.getServices = async (req, res) => {
  try {
    const services = await databases.listDocuments(
      process.env.APPWRITE_DATABASE_ID,
      SERVICES_COLLECTION_ID
    );

    res.status(200).json({ success: true, services: services.documents });
  } catch (error) {
    console.error('Error fetching services:', error);
    res.status(500).json({ error: "Failed to fetch services" });
  }
};

exports.updateService = async (req, res) => {
  const { id } = req.params;
  const { title, description, verse, image, schedule } = req.body;

  try {
    const service = await databases.updateDocument(
      process.env.APPWRITE_DATABASE_ID,
      SERVICES_COLLECTION_ID,
      id,
      {
        title,
        description,
        verse: verse || "",
        image,
        schedule: schedule || []
      }
    );

    res.status(200).json({ success: true, service });
  } catch (error) {
    console.error('Error updating service:', error);
    res.status(500).json({ error: "Failed to update service" });
  }
};

exports.deleteService = async (req, res) => {
  const { id } = req.params;

  try {
    await databases.deleteDocument(
      process.env.APPWRITE_DATABASE_ID,
      SERVICES_COLLECTION_ID,
      id
    );

    res.status(200).json({ success: true, message: "Service deleted successfully" });
  } catch (error) {
    console.error('Error deleting service:', error);
    res.status(500).json({ error: "Failed to delete service" });
  }
};

exports.uploadServiceImage = [upload.single('file'), async (req, res) => {
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
  } catch (error) {
    console.error('File upload error:', error);
    res.status(500).json({ error: 'Failed to upload file' });
  }
}];