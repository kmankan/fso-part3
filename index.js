const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')

app.use(cors())

app.use(express.json())
// morgan middleware for logging incoming requests

morgan.token('post', function (req, res) {
  return JSON.stringify(req.body)
})

app.use(morgan('tiny', {
// skip this use of morgan if the method is a POST request 
// i.e. we use tiny for everything except POST methods
skip: function (req, res) {return req.method === "POST"}
}))

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :post', {
  // skip this use of morgan if the method is not a POST request
  skip: function (req, res) {return req.method !== "POST"}
}))

// Custom middleware to log request time
app.use((request, response, next) => {
  
  const date = new Date();
  request.requestTime = new Intl.DateTimeFormat('en-GB', {
    dateStyle: 'full',
    timeStyle: 'long',
    timeZone: 'Australia/Sydney',
  }).format(date)
  next();
});

let persons = 
[
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
  response.json(persons)
})

app.get('/api/info', (request, response) => {
  const responseInfo =
  `
  <p>Phonebook has info for ${persons.length} people</p>
  </br>
  <p>${request.requestTime}</p>
  `;
  
  response.send(responseInfo);
  })

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id;
  const person = persons.find(p => p.id === id);
  
  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id;
  const deletion = persons.find(p => p.id === id)
  const personsAfterDelete = persons.filter(p => p.id !== id);

  if (personsAfterDelete.length < persons.length) {
    persons = personsAfterDelete;
    response.json({deleted: deletion});
    response.status(204).end()
  } else {
    response.status(404).json({ error: 'persons not found' }); // Handle case where person is not found
  }
})

const generateId = () => {
  let newId;
  if (persons.length > 0) {
      newId = Math.floor(Math.random() * 10000)
    } else newId = 0
  
  return String(newId)
}

app.post('/api/persons', (request, response) => {
  const body = request.body
  const personArray = persons.map(p => p.name);

  if (!body.name) {
    return response.status(400).json({ 
      error: 'name missing' 
    })
  }

  if (!body.number) {
    return response.status(400).json({
      error: 'number missing'
    })
  }

  if (personArray.includes(body.name)) {
    return response.status(400).json({
      error: 'name must be unique'
    })
  }

  const person = {
    name: body.name,
    number: String(body.number),
    id: generateId()
  }

  persons = persons.concat(person)

  response.json(persons)
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})