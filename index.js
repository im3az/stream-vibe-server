const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

// console.log(process.env.DB_USER);
// console.log(process.env.DB_PASS);

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.thriitw.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const movieCollection = client.db("streamVibe").collection("movies");
    const cartCollection = client.db("streamVibe").collection("cart");

    app.get("/movie/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const query = { _id: new ObjectId(id) };
      const result = await movieCollection.findOne(query);
      res.send(result);
    });

    app.get("/movies", async (req, res) => {
      const cursor = movieCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.post("/movies", async (req, res) => {
      const newMovie = req.body;
      // console.log(newMovie);
      const result = await movieCollection.insertOne(newMovie);
      res.send(result);
    });

    app.get("/details/:_id", async (req, res) => {
      const _id = req.params._id;
      const query = { _id: new ObjectId(_id) };
      const details = await movieCollection.findOne(query);
      res.send(details);
    });

    app.get("/cart", async (req, res) => {
      const cursor = cartCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.post("/cart", async (req, res) => {
      const newItem = req.body;
      const result = await cartCollection.insertOne(newItem);
      res.send(result);
    });

    app.delete("/cart/:id", async (req, res) => {
      const id = req.params.id;
      // console.log(id);
      const query = { _id: id };
      console.log(query);
      const result = await cartCollection.deleteOne(query);
      // console.log(result);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("StreamVibe server is running");
});

app.listen(port, () => {
  console.log(`StreamVibe is running on port: ${port}`);
});
