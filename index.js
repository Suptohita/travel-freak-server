const express = require('express')
const cors = require('cors')
const {MongoClient} = require('mongodb')

require('dotenv').config()

const app = express()
const port = process.env.PORT || 8000


// middleware
app.use(cors())
app.use(express.json())


const uri = "mongodb+srv://travel:LChc1N5sido2XXDX@cluster0.tv1bc.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
    try{
        await client.connect()

        const database = client.db("travel")
        const destinationsCollection = database.collection("destinations")


        
        // Get API 
        app.get('/destinations', async(req, res) => {
            const cursor = destinationsCollection.find({})
            const destinations = await cursor.toArray()
            res.send(destinations)
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