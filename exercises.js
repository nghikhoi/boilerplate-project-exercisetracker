const exercisesDb = []

const exerciseSearchById = (id) => {
    return exercisesDb.filter(o => o.id == id)
}

const addExcersize = (id, description, duration, date) => {
    exercisesDb.push({
        id,
        description,
        duration,
        date: date
    })
}

module.exports = { exerciseSearchById, addExcersize }