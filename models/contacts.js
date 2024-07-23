const mongoose = require('mongoose')
require('dotenv').config()

// mongoDB url
const url = process.env.MONGODB_URL;

mongoose.set('strictQuery',false)

console.log('connecting to: ', url)

mongoose.connect(url)
.then(result => {
  console.log('connected to MongoDB')
})
.catch(error => {
  console.log('error connecting to MongoDB: ', error.message)
})

// Connection events
const db = mongoose.connection;

db.on('error', (error) => {
  console.error('Database connection error:', error);
});

db.on('disconnected', () => {
  console.log('Disconnected from MongoDB');
});

db.on('reconnected', () => {
  console.log('Reconnected to MongoDB');
});

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)

