const Person = ({person, handleDelete}) => {
    const handlePersonDelete = () => {
        if (window.confirm(`Delete ${person.name}`)) {
            handleDelete(person.id)
        }
    }

    return <div>
        {person.name} {person.number}
        <button onClick={handlePersonDelete}>delete</button>
    </div>
}

export default Person;