const express = require("express");
const app = express();
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const cors = require("cors");
const port = process.env.PORT || 5000;

//middlewere
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("boss is sitting");
});

const uri = `mongodb+srv://${process.env.BOSS_USER}:${process.env.BOSS_PASS}@cluster10.dn0f8be.mongodb.net/?retryWrites=true&w=majority`;

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
    await client.connect();

    const menuCollation = client.db("bossDB").collection("menu");
    const cartsCollation = client.db("bossDB").collection("carts");
    const usersCollation = client.db("bossDB").collection("users");
//menu related api
    app.get("/menu", async (req, res) => {
      const result = await menuCollation.find().toArray();
      res.send(result);
    });
// users related api
app.get('/users', async(req,res)=>{
  const result = await usersCollation.find().toArray();
  res.send(result);
})


app.post('/users', async(req,res)=>{
  const user = req.body;
  const result = await usersCollation.insertOne(user);
  res.send(result);
})
// carts related api
    app.get("/carts", async(req, res) => {
      const email = req.query.email;
      if(!email){
        res.send([]);
      }
      const query = {email: email};
      const result = await cartsCollation.find(query).toArray();
      res.send(result);
    });
// post related api
    app.post("/carts", async (req, res) => {
      const item = req.body;
      console.log(item);
      const result = await cartsCollation.insertOne(item);
      res.send(result);
    });

    // delete related api....

    app.delete('/carts/:id', async(req,res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await cartsCollation.deleteOne(query);
      res.send(result);
    })
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`boss is sitting on port:${port}`);
});
