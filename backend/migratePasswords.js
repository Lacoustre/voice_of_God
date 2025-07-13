const sdk = require('node-appwrite');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const client = new sdk.Client()
  .setEndpoint(process.env.APPWRITE_ENDPOINT)
  .setProject(process.env.APPWRITE_PROJECT_ID)
  .setKey(process.env.APPWRITE_API_KEY);

const databases = new sdk.Databases(client);

const DATABASE_ID = process.env.APPWRITE_DATABASE_ID;
const COLLECTION_ID = process.env.APPWRITE_ADMINS_COLLECTION_ID || '6857e27c003209cdf7ef';

// Function to hash a password
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

// Function to check if a password is already hashed
const isPasswordHashed = (password) => {
  // bcrypt hashes start with $2a$, $2b$, or $2y$
  return /^\$2[aby]\$\d+\$/.test(password);
};

// Main migration function
const migratePasswords = async () => {
  try {
    console.log('Starting password migration...');
    
    // Get all admins
    const result = await databases.listDocuments(DATABASE_ID, COLLECTION_ID);
    const admins = result.documents;
    
    console.log(`Found ${admins.length} admin accounts to check`);
    
    let migratedCount = 0;
    
    // Process each admin
    for (const admin of admins) {
      if (!admin.password) {
        console.log(`Admin ${admin.$id} has no password, skipping`);
        continue;
      }
      
      // Check if password is already hashed
      if (isPasswordHashed(admin.password)) {
        console.log(`Admin ${admin.$id} already has a hashed password`);
        continue;
      }
      
      // Hash the plain text password
      console.log(`Migrating password for admin ${admin.$id}`);
      const hashedPassword = await hashPassword(admin.password);
      
      // Update the admin document with the hashed password
      await databases.updateDocument(
        DATABASE_ID,
        COLLECTION_ID,
        admin.$id,
        { password: hashedPassword }
      );
      
      migratedCount++;
      console.log(`Successfully migrated password for admin ${admin.$id}`);
    }
    
    console.log(`Migration complete. Migrated ${migratedCount} passwords.`);
    
  } catch (error) {
    console.error('Error during password migration:', error);
  }
};

// Run the migration
migratePasswords();