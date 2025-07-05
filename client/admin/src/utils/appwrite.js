import { Client, Account, Databases, ID } from "appwrite";

const client = new Client()
  .setEndpoint(process.env.REACT_APP_APPWRITE_ENDPOINT || "https://nyc.cloud.appwrite.io/v1")
  .setProject(process.env.REACT_APP_APPWRITE_PROJECT_ID || "6857de38002bc7cb276f");

export const account = new Account(client);
export const databases = new Databases(client);

export const DATABASE_ID = process.env.REACT_APP_APPWRITE_DATABASE_ID || "6857e21200203c88be9a";
export const ADMINS_COLLECTION_ID = "admins";

export { ID };
export default client;