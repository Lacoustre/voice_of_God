const sdk = require('node-appwrite');
const crypto = require('crypto');
require('dotenv').config();

const client = new sdk.Client()
  .setEndpoint(process.env.APPWRITE_ENDPOINT)
  .setProject(process.env.APPWRITE_PROJECT_ID)
  .setKey(process.env.APPWRITE_API_KEY);

const databases = new sdk.Databases(client);

const DATABASE_ID = process.env.APPWRITE_DATABASE_ID;
const COLLECTION_ID = process.env.APPWRITE_ADMINS_COLLECTION_ID || '6857e27c003209cdf7ef';

// Function to hash a password using SHA-256 (compatible with 50 char limit)
const hashPassword = (password) => {
  const salt = process.env.TOKEN_SECRET || 'default-salt-value';
  return crypto.createHmac('sha256', salt).update(password).digest('hex').substring(0, 50);
};

// Function to check if a password is already hashed (SHA-256 produces 64 char hex, but we truncate to 50)
const isPasswordHashed = (password) => {
  // Check if it's a hex string of appropriate length
  return /^[0-9a-f]{40,50}$/.test(password);
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
      const hashedPassword = hashPassword(admin.password);
      console.log(`Generated hash of length: ${hashedPassword.length}`);
      
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