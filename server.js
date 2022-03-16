const express = require('express')
const app = express()
const cors = require('cors')
const { usersDb, userSearchByUsername, userSearchById, createNewUser } = require('./users.js')
const { exerciseSearchById, addExcersize } = require('./exercises.js')
require('dotenv').config()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

app.route('/api/users')
    .get((req, res) => {
      res.json(usersDb.map(user => {
        return {
          username: user.username,
          _id: user.id
        }
      }))
    })
    .post((req, res) => {
      var username = req.body['username']
      createNewUser(username)
      var user = userSearchByUsername(username)
      res.json({
        username: user.username,
        _id: user.id
      })
    })

app.route('/api/users/:_id/exercises')
    .post((req, res) => {
      var id = req.params._id
      var description = req.body['description']
      var duration = parseInt(req.body['duration'])
      var dateStr = req.body['date']
      var date

      if (!dateStr)
        date = new Date().getTime()
      else date = Date.parse(dateStr)

      var user = userSearchById(id)
      addExcersize(id, description, duration, date)
      res.json({
        _id: user.id,
        username: user.username,
        date: new Date(date).toDateString(),
        duration, 
        description
      })
    })

app.route('/api/users/:_id/logs')
    .get((req, res) => {
      var from = req.query.from
      var to = req.query.to
      var limit = req.query.limit

      console.log(`${from} && ${to} && ${limit} && ${req.query}`)
      console.log(`${!from}`)

      var id = req.params._id
      var user = userSearchById(id)
      if (!user) {
        res.json(user)
        return
      }
      var log = exerciseSearchById(id)

      var result = {
        username: user.username,
        count: log.length,
        _id: user.id
      }

      if (from) {
        var fromTime = Date.parse(from)
        log = log.filter(l => l.date >= fromTime)
        result.from = new Date(fromTime).toDateString()
      }

      if (to) {
        var toTime = Date.parse(to)
        log = log.filter(l => l.date <= toTime)
        result.to = new Date(toTime).toDateString()
      }

      if (limit && !isNaN(limit)) {
        var limitNumber = parseInt(limit)
        log = log.slice(0, limit)
      }

      result.log = log.map(ex => {
        return {
          description: ex.description,
          duration: ex.duration,
          date: new Date(ex.date).toDateString()
        }
      })

      res.json(result)
    })

console.log(process.env.PORT)

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
