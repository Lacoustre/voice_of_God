const sdk = require("node-appwrite");

const client = new sdk.Client()
  .setEndpoint(process.env.APPWRITE_ENDPOINT)
  .setProject(process.env.APPWRITE_PROJECT_ID)
  .setKey(process.env.APPWRITE_API_KEY);

const databases = new sdk.Databases(client);

// Collection IDs should be added to .env file
// TOP_CAROUSEL_COLLECTION_ID=your_collection_id
// DONATION_CAROUSEL_COLLECTION_ID=your_collection_id

exports.getTopCarousel = async (req, res) => {
  try {
    const carousel = await databases.listDocuments(
      process.env.APPWRITE_DATABASE_ID,
      process.env.TOP_CAROUSEL_COLLECTION_ID,
      // Only return published items for public consumption
      [sdk.Query.equal('published', true)]
    );
    res.status(200).json({ success: true, carousel: carousel.documents });
  } catch (error) {
    console.error('Error fetching top carousel:', error);
    res.status(500).json({ error: "Failed to fetch top carousel" });
  }
};

exports.getDonationCarousel = async (req, res) => {
  try {
    const carousel = await databases.listDocuments(
      process.env.APPWRITE_DATABASE_ID,
      process.env.DONATION_CAROUSEL_COLLECTION_ID,
      // Only return published items for public consumption
      [sdk.Query.equal('published', true)]
    );
    res.status(200).json({ success: true, carousel: carousel.documents });
  } catch (error) {
    console.error('Error fetching donation carousel:', error);
    res.status(500).json({ error: "Failed to fetch donation carousel" });
  }
};

exports.createTopCarouselItem = async (req, res) => {
  try {
    const { image, title, description, published = false } = req.body;
    const carouselItem = await databases.createDocument(
      process.env.APPWRITE_DATABASE_ID,
      process.env.TOP_CAROUSEL_COLLECTION_ID,
      sdk.ID.unique(),
      { image, title, description, published }
    );
    res.status(201).json({ success: true, carouselItem });
  } catch (error) {
    console.error('Error creating top carousel item:', error);
    res.status(500).json({ error: "Failed to create carousel item" });
  }
};

exports.createDonationCarouselItem = async (req, res) => {
  try {
    const { image, title, description, published = false } = req.body;
    const carouselItem = await databases.createDocument(
      process.env.APPWRITE_DATABASE_ID,
      process.env.DONATION_CAROUSEL_COLLECTION_ID,
      sdk.ID.unique(),
      { image, title, description, published }
    );
    res.status(201).json({ success: true, carouselItem });
  } catch (error) {
    console.error('Error creating donation carousel item:', error);
    res.status(500).json({ error: "Failed to create donation carousel item" });
  }
};