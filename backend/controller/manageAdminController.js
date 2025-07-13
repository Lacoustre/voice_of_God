const sdk = require("node-appwrite");
const { hashPassword } = require('./authController');
require("dotenv").config();

const client = new sdk.Client()
  .setEndpoint(process.env.APPWRITE_ENDPOINT)
  .setProject(process.env.APPWRITE_PROJECT_ID)
  .setKey(process.env.APPWRITE_API_KEY);

const databases = new sdk.Databases(client);

const DATABASE_ID = process.env.APPWRITE_DATABASE_ID;
const COLLECTION_ID = '6857e27c003209cdf7ef'; // Admins collection ID

exports.createAdmin = async (req, res) => {
  const {
    name,
    email,
    username,
    profile_image,
    address,
    dateofbirth,
    password,
    phone,
  } = req.body;

  if (!name || !email || !profile_image || !address || !dateofbirth || !password || !phone) {
    return res.status(400).json({ error: "Missing required admin fields" });
  }

  try {
    const existing = await databases.listDocuments(DATABASE_ID, COLLECTION_ID, [
      sdk.Query.equal("email", email),
      sdk.Query.limit(1),
    ]);

    if (existing.total > 0) {
      return res.status(409).json({ error: "An admin with this email already exists." });
    }

    const permissions = [
      sdk.Permission.read(sdk.Role.users()),
      sdk.Permission.update(sdk.Role.users()),
      sdk.Permission.delete(sdk.Role.users()),
    ];

    const hashedPassword = await hashPassword(password);
    
    const result = await databases.createDocument(
      DATABASE_ID,
      COLLECTION_ID,
      sdk.ID.unique(),
      {
        name,
        email,
        username,
        profile_image,
        address,
        dateofbirth,
        password: hashedPassword,
        phone,
      },
      permissions
    );

    res.status(201).json(result);
  } catch (error) {
    console.error("Error creating admin:", error.message);
    res.status(500).json({ error: error.message });
  }
};



exports.getAdmins = async (req, res) => {
  try {
    const result = await databases.listDocuments(DATABASE_ID, COLLECTION_ID);
    res.status(200).json({ admins: result.documents });
  } catch (error) {
    console.error("Error fetching admins:", error.message);
    res.status(500).json({ error: error.message });
  }
};

exports.getAdminById = async (req, res) => {
  const { id } = req.params;
  
  try {
    const result = await databases.getDocument(DATABASE_ID, COLLECTION_ID, id);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching admin:", error.message);
    res.status(500).json({ error: error.message });
  }
};

exports.deleteAdmin = async (req, res) => {
  const { id } = req.params;

  try {
    await databases.deleteDocument(DATABASE_ID, COLLECTION_ID, id);
    res.status(200).json({ success: true, message: "Admin deleted successfully" });
  } catch (error) {
    console.error("Error deleting admin:", error.message);
    res.status(500).json({ error: error.message });
  }
};

exports.updateAdmin = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  try {
    console.log("Updating admin with ID:", id);
    console.log("Update data:", updateData);

    if (!id) {
      return res.status(400).json({ error: "Admin ID is required" });
    }

    const currentAdmin = await databases.getDocument(
      DATABASE_ID,
      COLLECTION_ID,
      id
    );

    console.log("Current admin before update:", currentAdmin);

    const fieldsToUpdate = {};
    
    if (updateData.name) fieldsToUpdate.name = updateData.name;
    if (updateData.email) fieldsToUpdate.email = updateData.email;
    if (updateData.username) fieldsToUpdate.username = updateData.username;
    if (updateData.phone) fieldsToUpdate.phone = updateData.phone;
    if (updateData.dateofbirth) fieldsToUpdate.dateofbirth = updateData.dateofbirth;
    if (updateData.address) fieldsToUpdate.address = updateData.address;
    if (updateData.password) fieldsToUpdate.password = await hashPassword(updateData.password);
    if (updateData.profile_image !== undefined) {
      fieldsToUpdate.profile_image = updateData.profile_image;
      console.log("Profile image being updated to:", updateData.profile_image);
    }

    console.log("Fields to update:", fieldsToUpdate);

    const result = await databases.updateDocument(
      DATABASE_ID,
      COLLECTION_ID,
      id,
      fieldsToUpdate
    );
    
    console.log("Update result:", result);
    console.log("Updated profile_image:", result.profile_image);
    
    res.status(200).json(result);
  } catch (error) {
    console.error("Error updating admin:", error.message);
    console.error("Full error:", error);
    
    if (error.code === 404) {
      return res.status(404).json({ error: "Admin not found" });
    }
    if (error.code === 401) {
      return res.status(401).json({ error: "Unauthorized to update admin" });
    }
    
    res.status(500).json({ error: error.message });
  }
};

exports.updateCurrentUserProfile = async (req, res) => {
  const updateData = req.body;
  const { userId } = updateData;

  try {
    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const fieldsToUpdate = {};
    
    if (updateData.name) fieldsToUpdate.name = updateData.name;
    if (updateData.email) fieldsToUpdate.email = updateData.email;
    if (updateData.username) fieldsToUpdate.username = updateData.username;
    if (updateData.phone) fieldsToUpdate.phone = updateData.phone;
    if (updateData.dateofbirth) fieldsToUpdate.dateofbirth = updateData.dateofbirth;
    if (updateData.address) fieldsToUpdate.address = updateData.address;
    if (updateData.password) fieldsToUpdate.password = await hashPassword(updateData.password);
    if (updateData.profile_image !== undefined) {
      fieldsToUpdate.profile_image = updateData.profile_image;
    }

    const result = await databases.updateDocument(
      DATABASE_ID,
      COLLECTION_ID,
      userId,
      fieldsToUpdate
    );
    
    res.status(200).json(result);
  } catch (error) {
    console.error("Error updating current user profile:", error.message);
    res.status(500).json({ error: error.message });
  }
};
