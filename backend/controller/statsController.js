require("dotenv").config();
const sdk = require("node-appwrite");

const client = new sdk.Client()
  .setEndpoint(process.env.APPWRITE_ENDPOINT)
  .setProject(process.env.APPWRITE_PROJECT_ID)
  .setKey(process.env.APPWRITE_API_KEY);

const databases = new sdk.Databases(client);

exports.getDashboardStats = async (req, res) => {
  try {
    const databaseId = process.env.APPWRITE_DATABASE_ID;

    const [membersRes, eventsRes, contactRes] = await Promise.all([
      databases.listDocuments(databaseId, process.env.MEMBERS_COLLECTION_ID),
      databases.listDocuments(databaseId, process.env.EVENTS_COLLECTION_ID),
      databases.listDocuments(databaseId, process.env.CONTACT_COLLECTION_ID),
    ]);

    const totalMembers = membersRes.total;

    const unapprovedMembers = membersRes.documents.filter(
      (member) => member.approved === false
    ).length;

    const unrepliedMessages = contactRes.total;

    const upcomingEvents = eventsRes.documents.filter((event) => {
      const today = new Date();
      const eventDate = new Date(event.date);
      return eventDate >= today;
    }).length;

    res.status(200).json({
      totalMembers,
      unrepliedMessages,
      upcomingEvents,
      unapprovedMembers,
    });
  } catch (err) {
    console.error("Dashboard Stats Error:", err.message);
    res.status(500).json({ error: "Failed to fetch dashboard stats" });
  }
};
