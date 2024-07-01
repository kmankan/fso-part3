const express = require('express')
const app = express()

app.use(express.json())

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

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})