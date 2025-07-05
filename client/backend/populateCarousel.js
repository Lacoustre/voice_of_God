require('dotenv').config();
const sdk = require('node-appwrite');

const client = new sdk.Client()
  .setEndpoint(process.env.APPWRITE_ENDPOINT)
  .setProject(process.env.APPWRITE_PROJECT_ID)
  .setKey(process.env.APPWRITE_API_KEY);

const databases = new sdk.Databases(client);

const topCarouselImages = [
  {
    image: "https://example.com/church_photo_1.jpg",
    title: "Sunday Service",
    description: "Join us for worship every Sunday"
  },
  {
    image: "https://example.com/church_photo_2.jpg", 
    title: "Community Fellowship",
    description: "Building relationships in faith"
  },
  {
    image: "https://example.com/church_photo_3.jpg",
    title: "Prayer Meeting",
    description: "Come together in prayer"
  }
];

const donationCarouselImages = [
  {
    image: "https://example.com/donation_1.jpg",
    title: "Help Those in Need",
    description: "Your donation makes a difference"
  },
  {
    image: "https://example.com/donation_2.jpg",
    title: "Community Outreach",
    description: "Supporting our local community"
  }
];

async function populateCarousel() {
  try {
    console.log('Populating top carousel...');
    
    // Check if collections exist, if not, you'll need to create them in Appwrite console first
    if (!process.env.TOP_CAROUSEL_COLLECTION_ID || !process.env.DONATION_CAROUSEL_COLLECTION_ID) {
      console.log('Please add TOP_CAROUSEL_COLLECTION_ID and DONATION_CAROUSEL_COLLECTION_ID to your .env file');
      console.log('Create these collections in your Appwrite console first with the following attributes:');
      console.log('- image (string)');
      console.log('- title (string)');
      console.log('- description (string)');
      return;
    }

    // Populate top carousel
    for (const item of topCarouselImages) {
      await databases.createDocument(
        process.env.APPWRITE_DATABASE_ID,
        process.env.TOP_CAROUSEL_COLLECTION_ID,
        sdk.ID.unique(),
        item
      );
    }

    // Populate donation carousel
    for (const item of donationCarouselImages) {
      await databases.createDocument(
        process.env.APPWRITE_DATABASE_ID,
        process.env.DONATION_CAROUSEL_COLLECTION_ID,
        sdk.ID.unique(),
        item
      );
    }

    console.log('Carousel data populated successfully!');
  } catch (error) {
    console.error('Error populating carousel:', error);
  }
}

populateCarousel();