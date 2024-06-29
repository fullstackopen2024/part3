import {useEffect, useState} from "react";
import Persons from "./components/Persons.jsx";
import SearchFilter from "./components/SearchFilter.jsx";
import PersonForm from "./components/PersonForm.jsx";
import personService from "./services/persons.js"
import Notification from "./components/Notification.jsx";

function App() {
    const [persons, setPersons] = useState([])

    useEffect(() => {
        personService.getPersons().then(response => setPersons(response.data))
    }, []);

    const [newName, setNewName] = useState('')
    const [newNumber, setNewNumber] = useState('')
    const [search, setSearch] = useState('')
    const [searchPersons, setSearchPersons] = useState(persons)
    const [notificationMessage, setNotificationMessage] = useState()

    const successfullyAddedPersonNotification = (name) => {
        return {
            message: `Successfully added person ${name}`,
            type: 'success'
        }
    }

    const errorPersonRemovedFromServer = (name) => {
        return {
            message: `Information of ${name} has already been removed from server`,
            type: 'error'
        }
    }

    const errorReceivedFromServer = (error) => {
        return {
            message: `Server returned an error: ${error.response.data.error}`,
            type: `error`
        }
    }

    function handleNameChange(event) {
        setNewName(event.target.value)
    }

    function handleNumberChange(event) {
        setNewNumber(event.target.value)
    }

    function handleSearchChange(event) {
        const searchString = event.target.value
        const matchingPersons = persons.filter(peson => peson.name.toLowerCase().includes(searchString))
        setSearch(searchString)
        setSearchPersons(matchingPersons)
    }

    function handleFromSubmit(event) {
        event.preventDefault()

        const existingPerson = persons.find(person => person.name === newName)
        if (existingPerson) {
            if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one ?`)) {
                const updatedPerson = {...existingPerson, number: newNumber};
                personService.updatePerson(updatedPerson).then(response => {
                    const updatedPersonFromServer = response.data;
                    setPersons(persons.map(p => p.id === updatedPersonFromServer.id ? updatedPersonFromServer : p))
                })
                    .catch(() => {
                        setNotificationMessage(errorPersonRemovedFromServer(existingPerson.name))
                        personService.getPersons().then(response => setPersons(response.data))
                    })
            }
            setNewName('')
            setNewNumber('')
            return;
        }

        const newPerson = {name: newName, number: newNumber};
        personService.addPerson(newPerson)
            .then(response => {
                setPersons(persons.concat(response.data))

                setNotificationMessage(successfullyAddedPersonNotification(response.data.name))
                setTimeout(() => setNotificationMessage(null), 5000)
            })
            .catch(error => {
                setNotificationMessage(errorReceivedFromServer(error))
                setTimeout(() => setNotificationMessage(null), 5000)

            })
        setNewName('')
        setNewNumber('')
    }

    function handlePersonDelete(id) {
        personService.deletePerson(id).then(() => setPersons(persons.filter(person => person.id !== id)))
    }

    return (
        <div>
            <h2>Phonebook</h2>
            {notificationMessage ? <Notification notification={notificationMessage}/> : null}
            <SearchFilter value={search} handleSearchChange={handleSearchChange}/>
            <PersonForm nameValue={newName} handleNameChange={handleNameChange}
                        numberValue={newNumber} handleNumberChange={handleNumberChange}
                        handleFromSubmit={handleFromSubmit}/>
            <Persons persons={search === '' ? persons : searchPersons} handlePersonDelete={handlePersonDelete}/>
        </div>
    )
}

export default App
