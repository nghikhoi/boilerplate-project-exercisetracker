const { v4: uuidv4 } = require("uuid")

const usersDb = []

const userSearchByUsername = (username) => {
    return usersDb.find(o => o.username == username)
}

const userSearchById = (id) => {
    return usersDb.find(o => o.id == id)
}

const createNewUser = (username) => {
    var oldUser = userSearchByUsername(username)
    if (oldUser) {
        return false
    }
    var user = {
        username: username,
        id: uuidv4()
    }
    usersDb.push(user)
    console.log(`Added user ${user.username} with id ${user.id}`)
    return true
}

module.exports = { usersDb, userSearchByUsername, userSearchById, createNewUser }