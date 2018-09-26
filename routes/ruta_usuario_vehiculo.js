const express = require('express')
const router = express.Router()
const UsuariosVehiculos = require('../controladores/UsuariosVehiculos')

router.get('/api/verificar-usuario-vehiculo/:ci/:placa', (req, res) => {
    UsuariosVehiculos.verificarUsuarioVehiculo(req.params).then((respuesta)=>{
        res.json(respuesta)
    },(error)=>{
        console.log(error)
    })
})

module.exports = router