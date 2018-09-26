const express = require('express')
const router = express.Router()
const Vehiculo = require('../controladores/Vehiculos')

router.get('/api/verificar-vehiculo-placa/:placa', (req, res) => {
    const { placa } = req.params
    Vehiculo.verificarVehiculoPlaca(placa).then((respuesta)=>{
        res.json(respuesta)
    },(error)=>{
        console.log(error)
    })
})
module.exports = router