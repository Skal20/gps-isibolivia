import fetch from 'node-fetch';
const express = require('express')
const router = express.Router()
const Dispositivo = require('../controladores/Dispositivos')
const {socket} = require('../src/sockets')

router.get('/api/verificar-dispositivo-codigo/:codigo', (req, res) => {
    const { codigo } = req.params
    Dispositivo.verificarDispositivoCodigo(codigo).then((respuesta)=>{
        res.json(respuesta)
    },(error)=>{
        console.log(error)
    })
})

router.get('/api/ubicacion/:latitud/:longitud/:velocidad/:dispositivo/:btnseguridad/:puerta/:bocina', (req, res) => {
    fetch(`https://roads.googleapis.com/v1/snapToRoads?path=${req.params.latitud},${req.params.longitud}&interpolate=true&key=AIzaSyArxe_F1EgraX6aaU6Ahj2jxniFaNe4ZiM`)
    .then(res => res.text())
    .then(body => {
        const { latitude, longitude } = JSON.parse(body).snappedPoints[0].location
        req.params.latitud = latitude.toFixed(6)
        req.params.longitud = longitude.toFixed(6)
        socket.emit('agregarUbicacion', req.params)
        Dispositivo.leerConfiguracionDispositivo(req.params.dispositivo).then((datos)=>{
            res.json(`${datos[0].numero_uno}/${datos[0].numero_dos}/${datos[0].numero_tres}/${datos[0].sensor_puerta}/${datos[0].boton_seguridad}/${datos[0].rastreo_tiempo_real}/${datos[0].bloqueo_motor}/${datos[0].alerta_bocina}/`)
        },(error)=>{
            console.log(error)
        })
        
    })
})

module.exports = router