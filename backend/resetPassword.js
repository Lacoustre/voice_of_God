require('dotenv').config();
const sdk = require('node-appwrite');

const client = new sdk.Client()
  .setEndpoint(process.env.APPWRITE_ENDPOINT)
  .setProject(process.env.APPWRITE_PROJECT_ID)
  .setKey(process.env.APPWRITE_API_KEY);

const databases = new sdk.Databases(client);

async function resetPassword() {
  try {
    // Get all admins
    const adminList = await databases.listDocuments(
      process.env.APPWRITE_DATABASE_ID,
      process.env.APPWRITE_ADMINS_COLLECTION_ID
    );
    
    console.log('Found admins:', adminList.documents.map(a => ({ email: a.email, id: a.$id })));
    
    // Update first admin password to plain text "admin123"
    if (adminList.documents.length > 0) {
      const admin = adminList.documents[0];
      await databases.updateDocument(
        process.env.APPWRITE_DATABASE_ID,
        process.env.APPWRITE_ADMINS_COLLECTION_ID,
        admin.$id,
        { password: 'admin123' }
      );
      
      console.log(`Password reset for ${admin.email} to: admin123`);
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

resetPassword();