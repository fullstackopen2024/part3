const express = require('express')
const morgan = require('morgan')

const app = express()

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :req-body'))
app.use(express.json())

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

app.get('/api/persons', (request, response) => {
    response.json(phonebooks)
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

app.get('/info', (request, response) => {
    const numberOfPeople = phonebooks.length;
    const infoForPeople = `<p>Phonebook has info for ${numberOfPeople} people</p>`;

    response.send(infoForPeople + getDateFormat());
})

app.get('/api/persons/:id', (req, res) => {
    const id = req.params.id;

    const person = phonebooks.find(p => p.id === id);

    if (person) {
        res.json(person)
    } else {
        res.status(404).end()
    }
})

app.delete('/api/persons/:id', (req, res) => {
    const id = req.params.id;

    phonebooks = phonebooks.filter(note => note.id !== id)

    res.status(204).end()
})

const generateId = () => {
    return Math.floor(Math.random() * 1000000);
}

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

    newPerson = {...newPerson, "id": String(generateId())}
    phonebooks = phonebooks.concat(newPerson);

    res.json(newPerson)
})

const PORT = 3001

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})
