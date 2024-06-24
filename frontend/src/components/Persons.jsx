import Person from "./Person.jsx";

const Persons = ({persons, handlePersonDelete}) => {
    return (
        <>
            <h2>Numbers</h2>
            {persons.map(person => <Person key={person.id} person={person} handleDelete={handlePersonDelete}/>)}
        </>
    )
}

export default Persons;