const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('give password as argument')
    process.exit(1)
}

const password = process.argv[2]

const connectionUrl = `mongodb+srv://vlad101vlad:${password}@cluster0.kd36r8e.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery', false)
mongoose.connect(connectionUrl)

const phonebookSchema = new mongoose.Schema({
    name: String,
    number: String
})
const Contact = mongoose.model('Contact', phonebookSchema);

if (process.argv.length === 3) {
    console.log('phonebook:')
    Contact
        .find({})
        .then(result => {
            result.forEach(contact => console.log(contact))
            mongoose.connection.close()
        })
    process.exit(1)
}

const name = process.argv[3]
const number = process.argv.length > 4 ? process.argv[4] : null;

const newContact = new Contact({
    name: name,
    number: number
})

newContact.save().then(() => {
    console.log(`added ${name} number ${number} to phonebook`)
    mongoose.connection.close()
})
