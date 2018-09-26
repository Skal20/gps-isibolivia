const express = require('express')
const router = express.Router()
const mysqlConnection = require('../database')
const Usuarios = require('../controladores/Usuarios')
const FechaHora = require('../controladores/FechaHora')

router.get('/api/autentificacion/:usuario/:pass', (req, res) => {
    Usuarios.autentificacion(req.params).then((respuesta)=>{
        res.json(respuesta)
    },(error)=>{
        console.log(error)
    })
})

router.get('/api/verificar-usuario-ci/:ci', (req, res) => {
    const { ci } = req.params
    Usuarios.verificarUsuarioCi(ci).then((respuesta)=>{
        res.json(respuesta)
    },(error)=>{
        console.log(error)
    })
})

router.get('/api/loginfallido/:usuario/:pass/:plataforma', (req, res) => {
    console.log(datos)
    Usuarios.loginFallido(datos).then((respuesta)=>{
        res.json(respuesta)
    },(error)=>{
        console.log(error)
    })
})

router.get('/api/agregarusuario/:ci', (req, res) => {
    const { ci } = req.params
    mysqlConnection.query('SELECT * FROM usuario WHERE ci = ?', [ci], (err, rows) => {
        if(!err){
            res.json(rows)
        } else {
            console.log(err)
        }
    })
})

router.get('/api/listausuario/', (req, res) => {
    mysqlConnection.query('SELECT * FROM usuario', (err, rows) => {
        if(!err){
            res.json(rows)
        } else {
            console.log(err)
        }
    })
    
})

module.exports = router