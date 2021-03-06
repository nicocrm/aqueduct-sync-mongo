const { MongoClient } = require("mongodb");

let connection = null;

// connect to local test database, drop it and return connection
// it only drops the database during the initial connection, subsequent calls to testConnection
// are cached
// the connection address is hard coded
module.exports = async function () {
  if (connection) return Promise.resolve(connection);

  const url = "mongodb://localhost:27017";
  const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
  await client.connect();
  const db = client.db("test");

  const collections = await db.listCollections({}).toArray();
  await Promise.all(
    collections.map((coll) => db.collection(coll.name).removeMany({}))
  );
  // make the collection exist, otherwise they'll log errors about missing indexes
  // this may give a promise error, the first time it runs, because the database may not exist yet, not sure if there is a good way to initialize it, no time to look right now
  // await db.dropCollection('Customers')
  connection = db;
  return connection;
};
