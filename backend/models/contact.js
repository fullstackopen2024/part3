const mongoose = require('mongoose')
mongoose.set('strictQuery', false)

const connectionUrl = process.env.MONGODB_URL;

mongoose.connect(connectionUrl)
    .then(() => console.log('connected to MongoDB'))
    .catch(error => console.log('error connecting to MongoDB:', error.message))


const phonebookSchema = new mongoose.Schema({
    name: String,
    number: String
})

phonebookSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})


module.exports = mongoose.model('Contact', phonebookSchema)
