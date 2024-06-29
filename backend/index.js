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
  }
  const time = new Intl.DateTimeFormat('en-US', options).format(Date.now())
  return '<p>' + time + '</p>'
}

app.get('/info', (request, response, next) => {
  Contact
    .find({})
    .then((result) => {
      const numberOfPeople = result.length
      const infoForPeople = `<p>Phonebook has info for ${numberOfPeople} people</p>`
      response.send(infoForPeople + getDateFormat())
    })
    .catch(error => next(error))
})

app.get('/api/persons/:id', (req, res, next) => {
  const { id } = req.params

  Contact
    .findById(id)
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
  const id = req.params.id

  Contact.findByIdAndDelete(id)
    .then(() => res.status(204).end())
    .catch(error => next(error))
})


app.post('/api/persons', (req, res, next) => {
  let newPerson = req.body

  newPerson = new Contact({
    name: newPerson.name,
    number: newPerson.number
  })

  newPerson.save()
    .then(savedPerson => res.json(savedPerson))
    .catch(error => next(error))
})

app.put('/api/persons/:id', (req, res, next) => {
  let updatedPerson = req.body

  Contact
    .findByIdAndUpdate(updatedPerson.id, updatedPerson, { new: true })
    .then(result => res.json(result))
    .catch(error => next(error))
})

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}


const PORT = process.env.PORT

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})

app.use(errorHandler)
