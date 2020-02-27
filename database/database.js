const Sequelize = require('sequelize')

const conn = new Sequelize('guiaperguntas', 'root', '', {
    host: 'localhost',
    dialect: 'mysql'
})

module.exports = conn