const mysql = require('mysql')

const mysqlConnection = mysql.createConnection({
    /*host: '127.0.0.1',
    user: 'root',
    password: '',
    database: 'gps'*/
    host: '35.232.105.20',
    user: 'isibolivia',
    password: '$Bolivarista20',
    database: 'gps_isibolivia'
})

mysqlConnection.connect(function (err) {
    if(err){
        console.log(err)
        return
    } else {
        console.log('---- Base de Datos conectado ----')
    }
})

module.exports = mysqlConnection