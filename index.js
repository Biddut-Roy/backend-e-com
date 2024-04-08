const express = require('express')
require('dotenv').config();
const app = express()
const cors = require("cors");
app.use(cors());
const port = process.env.PORT || 5000
const { MongoClient, ServerApiVersion } = require('mongodb');



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.malve12.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect();
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    await client.close();
  }
}
run().catch(console.dir);

const users = client.db("Economy").collection("User")





app.get('/', (req, res) => {
  res.send('Server running!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})