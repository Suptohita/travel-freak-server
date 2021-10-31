const express = require('express')
const cors = require('cors')
const {MongoClient} = require('mongodb')
const ObjectId = require('mongodb').ObjectId

require('dotenv').config()

const app = express()
const port = process.env.PORT || 8000


// middleware
app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tv1bc.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
    try{
        await client.connect()

        const database = client.db("travel")
        const destinationsCollection = database.collection("destinations")
        const bookingCollection = database.collection('booked-destinations')


        // Get API for home
        app.get('/destinations', async(req, res) => {
            const cursor = destinationsCollection.find({})
            const destinations = await cursor.toArray()
            res.send(destinations)
        })


        // Get Specific destination with id for placeorder
        app.get('/destinations/:id', async(req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)}
            const service = await destinationsCollection.findOne(query)
            res.send(service)
            console.log(service)
        })


        // add booking data to database 
        app.post('/booking', async(req, res) =>{
            const data = req.body
            const result = await bookingCollection.insertOne(data)
            res.send(result)
        })


        // load data from database for showing user order 
        app.get('/myorders', async(req, res) => {
            const cursor = bookingCollection.find({})
            const userOrders = await cursor.toArray()
            res.send(userOrders)
        })


        // delete user order 
        app.delete('/myorders/deleteorder/:id', async(req, res) => {
            console.log('hello')
            const id = req.params.id
            const query = {_id: ObjectId(id)}
            const result = await bookingCollection.deleteOne(query)
            res.send(result)
        })


        // manage all order
        app.get('/manageallorders', async(req, res) => {
            const cursor = bookingCollection.find({})
            const allOrders = await cursor.toArray()
            res.send(allOrders)
        })

        // manage all order delete 
        app.delete('/manageallorders/deleteorder/:id', async(req, res) => {
            const id = req.params.id
            const query = {_id: ObjectId(id)}
            const result = await bookingCollection.deleteOne(query)
            res.send(result)
            console.log('working')
        })
    
    }

    finally{
        // await client.close()
    }
}

run().catch(console.dir)
  

// testing 
app.get('/', (req, res) => {
    res.send('Server Running....')
})


// Listening port 
app.listen(port, () => {
    console.log('Server running at', port)
})