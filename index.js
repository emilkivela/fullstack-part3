const express = require('express')
const app = express()
const morgan = require('morgan')

app.use(express.json())

morgan.token('body', function(req) {
    return JSON.stringify(req.body)
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms - :body'))

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
      
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345",
    },
    {
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122",
    }
]
app.get('/', (request, response) => {
    response.send('<h1> Hello World! </h1>')
})

const generateID = () => {
    const id = Math.floor(Math.random() * 1000000)
    return id
}

app.get('/info', (request, response) => {
    date = new Date()
    response.send(`Phonebook has info for ${persons.length} people</br>${date}`)
})

app.get('/api/persons', (request,response) => {
    response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
})

app.post('/api/persons', (request, response) => {
    const body = request.body
    if (!body.name) {
        return response.status(400).json({
            error: 'name missing'
        })
    } else if (!body.number) {
        return response.status(400).json({
            error: 'number missing'
        })
    } else if (persons.some(person => person.name === body.name)) {
        return response.status(400).json({
            error: 'name must be unique'
        })
    }
    const person = {
        "id": generateID(),
        "name": body.name,
        "number": body.number
    }
    person.id = generateID()
    persons = persons.concat(person)
    response.json(person)
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server runnin on ${PORT}`)
})