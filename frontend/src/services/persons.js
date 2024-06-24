import axios from "axios";

const baseUrl = 'http://localhost:3001/api/persons'

const getPersons = () => {
    return axios.get(baseUrl)
}

const addPerson = (newPerson) => {
    return axios.post(baseUrl, newPerson)
}

const updatePerson  = (updatedPerson) => {
    return axios.put(baseUrl + `/${updatedPerson.id}`, updatedPerson)
}

const deletePerson = (id) => {
    return axios.delete(baseUrl + `/${id}`)
}

export default {
    getPersons,
    addPerson,
    updatePerson,
    deletePerson
}