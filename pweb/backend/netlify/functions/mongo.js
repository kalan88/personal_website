const { MongoClient } = require('mongodb');
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

let cachedDb = null;

const connectToMongoDB = async () => {
  if (cachedDb) return cachedDb;
  await client.connect();
  cachedDb = client.db();
  return cachedDb;
};

module.exports = { connectToMongoDB };
