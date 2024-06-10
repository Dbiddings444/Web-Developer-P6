const { MongoClient } = require("mongodb");
const { async } = require("rxjs");
const mongoose = require("mongoose");

mongoose.set("strictQuery", false);
const Schema = mongoose.Schema;

async function main() {
  // we'll add code here soon
  const uri = "mongodb+srv://dbiddings444:j7on3ZgsBvcLTDRl@diontescluster.uqvuaar.mongodb.net/?retryWrites=true&w=majority&appName=DiontesCluster";
  const client = new MongoClient(uri);
  const mongoDB = uri;

  await mongoose.connect(mongoDB)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err))
//   try {
//     // await client.connect();

//     // await listDatabases(client);
//   } catch (e) {
//     console.error(e);
//   } finally {
//     // await client.close();
//     console.log("connection was a success!!!")
//   }
}

main().catch(console.error);

async function listDatabases(client) {
  databasesList = await client.db().admin().listDatabases();

  console.log("Databases:");
  databasesList.databases.forEach( db => {
    console.log(` - ${db.name}`);
  });
}
