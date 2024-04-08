const express = require('express')
require('dotenv').config();
const app = express()
const bodyParser = require('body-parser');   
const cors = require("cors");
app.use(cors());
const bcrypt = require('bcrypt');
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

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

 // Sign-up endpoint
 app.post('/signup', async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  users.insertOne({ username: username, password: hashedPassword }, (err, result) => {
      if (err) {
          res.status(500).send('Error signing up');
      } else {
          res.status(200).send('Sign-up successful');
      }
  });
});

// Sign-in endpoint
app.post('/signin', async (req, res) => {
  const { username, password } = req.body;
  users.findOne({ username: username }, async (err, user) => {
      if (err) {
          res.status(500).send('Error signing in');
      } else if (!user) {
          res.status(404).send('User not found');
      } else {
          const passwordMatch = await bcrypt.compare(password, user.password);
          if (passwordMatch) {
              res.status(200).send('Sign-in successful');
          } else {
              res.status(401).send('Incorrect password');
          }
      }
  });
});



app.get('/', (req, res) => {
  res.send('Server running!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})