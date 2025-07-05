const sdk = require("node-appwrite");
const multer = require('multer');
const { InputFile } = require('node-appwrite/file');

const client = new sdk.Client()
  .setEndpoint(process.env.APPWRITE_ENDPOINT)
  .setProject(process.env.APPWRITE_PROJECT_ID)
  .setKey(process.env.APPWRITE_API_KEY);

const databases = new sdk.Databases(client);
const storage = new sdk.Storage(client);

const MEMBERS_COLLECTION_ID = "685fa34f0029a39d29fc";

const upload = multer({ storage: multer.memoryStorage() });

exports.createMember = async (req, res) => {
  const { name, phone, email, profile_image, address, groups, role, approved } = req.body;

  try {
    const member = await databases.createDocument(
      process.env.APPWRITE_DATABASE_ID,
      MEMBERS_COLLECTION_ID,
      sdk.ID.unique(),
      {
        name,
        phone,
        email,
        profile_image: profile_image || "",
        address: address || "",
        groups: groups || [],
        role,
        approved: false
      }
    );

    res.status(201).json({ success: true, member });
  } catch (error) {
    console.error('Error creating member:', error);
    res.status(500).json({ error: "Failed to create member" });
  }
};

exports.getMembers = async (req, res) => {
  try {
    const members = await databases.listDocuments(
      process.env.APPWRITE_DATABASE_ID,
      MEMBERS_COLLECTION_ID
    );

    res.status(200).json({ success: true, members: members.documents });
  } catch (error) {
    console.error('Error fetching members:', error);
    res.status(500).json({ error: "Failed to fetch members" });
  }
};

exports.updateMember = async (req, res) => {
  const { id } = req.params;
  const { name, phone, email, profile_image, address, groups, role, approved } = req.body;

  try {
    const member = await databases.updateDocument(
      process.env.APPWRITE_DATABASE_ID,
      MEMBERS_COLLECTION_ID,
      id,
      {
        name,
        phone,
        email,
        profile_image: profile_image || "",
        address: address || "",
        groups: groups || [],
        role,
        approved: approved !== undefined ? approved : false
      }
    );

    res.status(200).json({ success: true, member });
  } catch (error) {
    console.error('Error updating member:', error);
    res.status(500).json({ error: "Failed to update member" });
  }
};

exports.deleteMember = async (req, res) => {
  const { id } = req.params;

  try {
    await databases.deleteDocument(
      process.env.APPWRITE_DATABASE_ID,
      MEMBERS_COLLECTION_ID,
      id
    );

    res.status(200).json({ success: true, message: "Member deleted successfully" });
  } catch (error) {
    console.error('Error deleting member:', error);
    res.status(500).json({ error: "Failed to delete member" });
  }
};

exports.uploadMemberImage = [upload.single('file'), async (req, res) => {
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