const mongoose = require('mongoose')
mongoose.set('strictQuery', false)

const connectionUrl = process.env.MONGODB_URL;

mongoose.connect(connectionUrl)
    .then(() => console.log('connected to MongoDB'))
    .catch(error => console.log('error connecting to MongoDB:', error.message))

const validatePhoneNumber = (toValidate) => {
    const numberPattern = /^\d{2,3}-\d+$/;
    return numberPattern.test(toValidate);
}

const phonebookSchema = new mongoose.Schema({
    name: {
        type: String,
        minLength: 3,
        required: true
    },
    number: {
        type: String,
        minLength: 8,
        validate: {
            validator: validatePhoneNumber,
            message: props => `${props.value} is not a valid phone number!`
        },
        required: [true, 'User phone number required']
    }
})

phonebookSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})


module.exports = mongoose.model('Contact', phonebookSchema)
