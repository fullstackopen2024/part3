const PersonForm = ({nameValue, handleNameChange, numberValue, handleNumberChange, handleFromSubmit}) => {
    return (
        <>
            <h2>add a new</h2>
            <form onSubmit={handleFromSubmit}>
                <div>
                    name: <input value={nameValue} onChange={handleNameChange}/>
                </div>
                <div>
                    number: <input value={numberValue} onChange={handleNumberChange}/>
                </div>
                <div>
                    <button type="submit">add</button>
                </div>
            </form>
        </>
    )
}

export default PersonForm;