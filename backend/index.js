const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
require('dotenv').config()
const Contact = require('./models/contact')


const app = express()

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :req-body'))
app.use(express.json())
app.use(cors())

morgan.token('req-body', function (req) {
    return JSON.stringify(req.body)
})

let phonebooks = [
    {
        "id": "1",
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": "2",
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": "3",
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": "4",
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
]

app.get('/api/persons', (request, response, next) => {
    Contact
        .find({})
        .then((result) => {
            response.json(result)
        })
        .catch(error => next(error))
})

const getDateFormat = () => {
    const options = {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        timeZoneName: 'long',
        hour12: false
    };
    const time = new Intl.DateTimeFormat('en-US', options).format(Date.now());
    return '<p>' + time + '</p>';
}

app.get('/info', (request, response, next) => {
    Contact
        .find({})
        .then((result) => {
            const numberOfPeople = result.length;
            const infoForPeople = `<p>Phonebook has info for ${numberOfPeople} people</p>`;
            response.send(infoForPeople + getDateFormat());
        })
        .catch(error => next(error))
})

app.get('/api/persons/:id', (req, res, next) => {
    const id = req.params.id;

    Contact
        .findById({id})
        .then(result => {
            if (result) {
                res.json(result)
            } else {
                res.status(404).end()
            }
        })
        .catch(error => next(error))
})

app.delete('/api/persons/:id', (req, res, next) => {
    const id = req.params.id;

    Contact.findByIdAndDelete(id)
        .then(() => res.status(204).end())
        .catch(error => next(error))
})

const validateNewPerson = (newPerson) => {
    if (!newPerson.name || !newPerson.number) {
        const whatIsMissing = newPerson.name ? 'number' : 'name'
        return `${whatIsMissing} is missing`
    }

    const duplicateName = phonebooks.find(person => person.name === newPerson.name)
    if (duplicateName) {
        return 'name must be unique'
    }
    return '';
}

app.post('/api/persons', (req, res) => {
    let newPerson = req.body;

    const validationResult = validateNewPerson(newPerson)
    if (validationResult !== '') {
        return res.status(400).json({
            error: validationResult
        })
    }

    newPerson = new Contact({
        name: newPerson.name,
        number: newPerson.number
    })

    newPerson.save().then(savedPerson => res.json(savedPerson))
})

const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({error: 'malformatted id'})
    }

    next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})
