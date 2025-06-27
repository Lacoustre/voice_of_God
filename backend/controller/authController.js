const sdk = require("node-appwrite");
require("dotenv").config();

const client = new sdk.Client()
  .setEndpoint(process.env.APPWRITE_ENDPOINT)
  .setProject(process.env.APPWRITE_PROJECT_ID);

const account = new sdk.Account(client);

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const session = await account.createEmailSession(email, password);

    const user = await account.get();

    res.status(200).json({ token: session.secret, user });
  } catch (err) {
    console.error('Login error:', err);
    res.status(401).json({ error: "Invalid credentials" });
  }
};
