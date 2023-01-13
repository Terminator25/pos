const mongoose = require('mongoose')
const mongoURI = "mongodb+srv://Sashank:HEKkMtueO2uTvB1K@pointofsale.sd5k9yo.mongodb.net/pos"

const connectToMongo = ()=>{
    mongoose.connect(mongoURI, ()=>{
        console.log("connected to mongo")
    })
}

module.exports = connectToMongo