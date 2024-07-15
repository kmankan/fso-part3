const mongoose = require('mongoose')

// if third argument for password is not given, terminate the program
if (process.argv.length<3) {
  console.log('password argument needed')
  process.exit(1)
} else if (process.argv.length == 4) {
  console.log('invalid number of arguments -- must be either 3 or 5')
  process.exit(1)
}

// store provided password in variable
const password = process.argv[2]
// store contact name
const name = process.argv[3]
// store contact number
const number = process.argv[4]

// mongoDB url
const url = `mongodb+srv://malink027:${password}@fullstackopen-phonebook.4aoeplg.mongodb.net/phonebook?retryWrites=true&w=majority&appName=FullStackOpen-Phonebook`

mongoose.set('strictQuery',false)

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

const contact = new Person({
  name: name,
  number: number
})

if (process.argv.length == 5) {
  contact.save()
  .then(result => {
    console.log(`new contact added to the phonebook: ${result.name} ${result.number}`)
    console.log('the phonebook:')
    Person.find({}).then(result => {
      result.forEach(person => {
        console.log(`${person.name} ${person.number}`)
      })
      mongoose.connection.close()
    })
  })
} else if (process.argv.length == 3) {
    Person.find({}).then(result => {
      result.forEach(person => {
        console.log(`${person.name} ${person.number}`)
      })
      mongoose.connection.close()
    })}