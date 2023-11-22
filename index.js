//for dot env
require('dotenv').config();
//basic set up start 
const express=require('express');
const app=express();
const cors=require('cors');
const port= process.env.PORT || 5000;

//middleware 
app.use(cors());
app.use(express.json());

app.get('/',(req,res)=>{
  res.send('Bistro server on ...')
})
app.listen(port,()=>{
  console.log(`Bistro Boss Server is Running on port: ${port}`)
})

//basic setup end 


//it's time to connect mongodb atlas 
//this code is from  mongodb
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');//here object id came from app.delete (api)

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.6advhli.mongodb.net/?retryWrites=true&w=majority`;



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
    // Connect the client to the server	(optional starting in v4.7)
    //await client.connect();



/* my code start  */

//create collection for menu  
const menuCollection=client.db('bistroDb').collection('menu');
// to get all menu data 
app.get('/menu', async(req,res)=>{
  const result=await menuCollection.find().toArray();
  res.send(result);
})


//create collection for reviews 
const reviewsCollection=client.db('bistroDb').collection('reviews');
//to get all reviews data 
app.get('/reviews', async(req,res)=>{
  const result=await reviewsCollection.find().toArray();
  res.send(result);
})

//for creating cart collection (part -4 third video)
const cartCollection=client.db('bistroDb').collection('carts');
//to insert carts in database from client side 
app.post('/carts', async(req,res)=>{
  const cartItem=req.body;
  const result=await cartCollection.insertOne(cartItem);
  res.send(result);
})


// to get carts specific data (existing user) -localhost:5000/carts
app.get('/carts', async(req,res)=>{
  // valid email check after tan stack query setup 
  const email=req.query.email;
  const query={email:email}
  const result=await cartCollection.find(query).toArray();
  res.send(result);
})



//delete client code file name is Cart.jsx
app.delete('/carts/:id', async(req,res)=>{
  const id=req.params.id;
  const query={_id: new ObjectId(id)};
  const result=await cartCollection.deleteOne(query);
  res.send(result);
})




// created user related api and collection

const userCollection=client.db('bistroDb').collection('users');

// api 
app.post('/users', async(req,res)=>{
  const user =req.body;
  // insert email if user doesn't exit :
  // you can do this many ways (1. email unique, 2. upsert , 3. simple checking )
  const query={email: user.email}
  const existingUser=await userCollection.findOne(query);
  if(existingUser){
    return res.send({message:'user already exists', insertedId:null})
  }
  const result= await userCollection.insertOne(user);
  res.send(result);
})


//for all user (AllUser.jsx)
app.get('/users', async(req,res)=>{
  const result=await userCollection.find().toArray();
  res.send(result)
})





    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }
}
run().catch(console.dir);




