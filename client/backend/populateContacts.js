const sdk = require("node-appwrite");
require("dotenv").config();

const client = new sdk.Client()
  .setEndpoint(process.env.APPWRITE_ENDPOINT)
  .setProject(process.env.APPWRITE_PROJECT_ID)
  .setKey(process.env.APPWRITE_API_KEY);

const databases = new sdk.Databases(client);

const DATABASE_ID = process.env.APPWRITE_DATABASE_ID;
const COLLECTION_ID = "686158d00005863e7d47";

const sampleContacts = [
  {
    email: "jane@example.com",
    phone: "+1-555-0123",
    message: "Hi! I'd love to know more about upcoming church events and how to join. I'm new to the area and looking for a welcoming community to worship with my family. - Jane Doe"
  },
  {
    email: "john@gmail.com",
    phone: "+1-555-0456",
    message: "Please pray for my health. I'm currently recovering from surgery and could use the community's support during this difficult time. - John Smith"
  },
  {
    email: "maria.garcia@email.com", 
    phone: "+1-555-0789",
    message: "I'd like to volunteer for the upcoming community outreach program. I have experience with event planning and would love to help. - Maria Garcia"
  },
  {
    email: "david.wilson@example.com",
    phone: "+1-555-0321",
    message: "Could you please provide information about your youth ministry programs? My teenage daughter is interested in joining. - David Wilson"
  },
  {
    email: "sarah.j@email.com",
    phone: "+1-555-0654",
    message: "I'm interested in joining the church choir. What are the requirements and when do you hold auditions? - Sarah Johnson"
  }
];

async function populateContacts() {
  try {
    console.log("Populating contact messages...");
    
    for (const contact of sampleContacts) {
      const result = await databases.createDocument(
        DATABASE_ID,
        COLLECTION_ID,
        sdk.ID.unique(),
        contact
      );
      console.log(`Created contact: ${contact.email} - ${result.$id}`);
    }
    
    console.log("✅ All contact messages populated successfully!");
  } catch (error) {
    console.error("❌ Error populating contacts:", error);
  }
}

populateContacts();