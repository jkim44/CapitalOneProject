const app = require("./app.js");
const mongodb = require("./node_modules/mongodb");
//const transactionDAO = require("./dao/transactionDAO.js");

const MongoClient = mongodb.MongoClient;

const mongo_username = "HridayGupta";
const mongo_password = "HridayGupta";
const uri = `mongodb+srv://${mongo_username}:${mongo_password}@cluster0.6ibfiyk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
//const uri = `mongodb+srv://${mongo_username}:${mongo_password}@cluster0.6ibfiyk.mongodb.net/`;

const port = 8000;

const client = new MongoClient(uri, {
  maxPoolSize: 50,
  //wtimeoutMS: 2500,
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
/**
  .catch((err) => {
    console.error(err.stack);
    process.exit(1);
  })
  .then(async (client) => {
    app.listen(port, () => {
      console.log(`listening on port ${port}`);
    });
  });
  **/

async function run() {
  try {
    // Connect the client to the server
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("BankingDB").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!",
    );
  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }
}
run().catch(console.dir);
module.exports = client;
