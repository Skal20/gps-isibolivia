import io from 'socket.io-client'

let datosPersonales = {
    id: '',
    ci: '',
    ci_exp: '',
    nombre: '',
    imagen: '',
    tipo: ''
}

let socket = io.connect('http://localhost:8080')
 socket.on('connect', () => {
    datosPersonales.id = socket.io.engine.id;
    console.log('------ cliente socket:', socket.id)
 })

module.exports = {socket, datosPersonales}