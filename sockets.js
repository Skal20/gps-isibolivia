const Usuarios = require('./controladores/Usuarios')
const Vehiculos = require('./controladores/Vehiculos')
const UsuariosVehiculos = require('./controladores/UsuariosVehiculos')
const Dispositivos = require('./controladores/Dispositivos')
const Notificaciones = require('./controladores/Notificaciones')
const Eventos = require('./controladores/Eventos')
const FechaHora = require('./controladores/FechaHora')
module.exports = function(io){
    
    let usuariosConectados = []

    io.on('connection', socket => {
        console.log('Nuevo usuario conectado socket:', socket.id)
        socket.on('Autentificacion', (data, cb) => {
            let dat = {}
            console.log('Autentificacion socket:', socket.id)
            const res = usuariosConectados.find((usuarios)=>{
                return usuarios.ci === data.ci
            })
            if(res){
                cb(false)
            } else {
                dat = {
                    id: socket.id,
                    ci: data.ci
                }
                usuariosConectados = usuariosConectados.concat(dat)
                cb(true)
            }
            console.log(`${usuariosConectados.length} Usuarios: ${usuariosConectados}`)
        })

        socket.on('verificarUsuario', (data, cb) => {
            const res = usuariosConectados.find((usuarios)=>{
                return usuarios.id === data
            })
            if(res){
                cb(true)
            } else {
                cb(false)
            }
        })

        socket.on('disconnect', () => {
            if(!socket.id)return
            usuariosConectados.splice(usuariosConectados.indexOf(socket.id), 1)
            console.log('Usuario Desconectado', socket.id)
            console.log(`${usuariosConectados.length} Usuarios: ${usuariosConectados}`)
        })

        socket.on('agregarUsuario', (datos) => {
            var f=new Date()
            var hora=f.getHours()+":"+f.getMinutes()+":"+f.getSeconds()
            var fecha=f.getFullYear()+"-"+f.getMonth()+"-"+f.getDate()
            const { ci, ci_exp } = datos
            Usuarios.agregarUsuario(datos).then((res)=>{
                const datosUsuario = {ci: ci, ci_emisor: '8345976', informe: `Nueva cuenta de Usuario fue creado satisfactoriamente con CI: ${ci} ${ci_exp}`, fecha: fecha, hora: hora}
                
                Usuarios.agregarRegistroUsuario(datosUsuario).then((res)=>{
                    const datosEventoCliente = {ci: ci, plataforma: 'web', fecha: fecha, hora: hora, mensaje: `ISI BOLIVIA te da la Bienvenida a su Sistema de Rastreo Vehicular.`}
                    
                    Eventos.agregarEventoCliente(datosEventoCliente).then((res)=>{
                        const datosTipo = 'Root_Administrador'

                        Usuarios.listaUsuariosTipo(datosTipo).then((res)=>{
                            for(var i = 0 ; i < res.length ; i++){
                                const datosTipo = {ci_emisor: '8345976', ci_remitente: res[i].ci, fecha_emisor: fecha, hora_emisor: hora, estado: 'Entregado', mensaje: `Nueva cuenta de Usuario fue creado satisfactoriamente con CI: ${ci} ${ci_exp}`}
                                Notificaciones.agregarEntregaNotificacion(datosTipo).then((res)=>{
                                    io.emit('actualizaNotificacion', datos)
                                },(error)=>{
                                    console.log(error)
                                })
                            }
                        },(error)=>{
                            console.log(error)
                        })

                        io.emit('actualizaEventoCliente', datos)
                    },(error)=>{
                        console.log(error)
                    })

                    io.emit('actualizarRegistroUsuario', datos)
                },(error)=>{
                    console.log(error)
                })

                io.emit('listaUsuarios', datos)
            },(error)=>{
                console.log(error)
            })

        })

        socket.on('listaUsuarios', () => {
            Usuarios.listaUsuarios().then((res)=>{
                io.emit('listaUsuarios', res) 
            }, (error)=>{
                console.log(error)
            })
        })

        socket.on('agregarVehiculo', (datos) => {
            const {fecha, hora} = FechaHora.getFechaHoraActualMysql()
            const { placa, emisor } = datos

            Vehiculos.agregarVehiculo(datos).then((res)=>{
                const datosRegistroVehiculo = {placa: placa, ci_emisor: emisor, informe: `Nuevo vehiculo fue registrado satisfactoriamente con Nro. de Placa: ${placa}`, fecha: fecha, hora: hora}
                
                Vehiculos.agregarRegistroVehiculo(datosRegistroVehiculo).then((res)=>{
                    const datosTipo = 'Root_Administrador'

                    Usuarios.listaUsuariosTipo(datosTipo).then((res)=>{
                        for(var i = 0 ; i < res.length ; i++){
                            const datosTipo = {ci_emisor: emisor, ci_remitente:  res[i].ci, fecha_emisor: fecha, hora_emisor: hora, estado: 'Entregado', mensaje: `Nuevo vehiculo fue registrado satisfactoriamente con Nro. de Placa: ${placa}`}
                            Notificaciones.agregarEntregaNotificacion(datosTipo).then((respuesta)=>{
                                const resultado = usuariosConectados.find( iden => iden.ci === datosTipo.ci_remitente );
                                if(typeof resultado != 'undefined'){
                                    io.to(resultado.id).emit('notificacionesRoot', datosTipo)
                                }
                                
                            },(error)=>{
                                console.log(error)
                            })
                        }
                    },(error)=>{
                        console.log(error)
                    })

                    io.emit('actualizaEventoCliente', datos)

                },(error)=>{
                    console.log(error)
                })
                
                io.emit('listaVehiculos', datos)
            },(error)=>{
                console.log(error)
            })

        })

        socket.on('agregarUsuarioVehiculo', (datos) => {
            const {fecha, hora} = FechaHora.getFechaHoraActualMysql()
            const { placa, ci, emisor } = datos

            UsuariosVehiculos.agregarUsuarioVehiculo(datos).then((res)=>{
                const datosRegistroUsuarioVehiculo = {ci: ci, placa: placa, ci_emisor: emisor, informe: `Vehiculo con Nro. de Placa ${placa} fue registrado en la cuenta del Usuario ${ci} satisfactoriamente`, fecha: fecha, hora: hora}
                
                UsuariosVehiculos.agregarRegistroUsuarioVehiculo(datosRegistroUsuarioVehiculo).then((res)=>{
                    const datosEventoCliente = {ci: ci, plataforma: 'web', fecha: fecha, hora: hora, mensaje: `Un nuevo vehiculo con Nro. de Placa ${placa} fue agregado a su cuenta`}
                
                    Eventos.agregarEventoCliente(datosEventoCliente).then((res)=>{
                    const datosTipo = 'Root_Administrador'

                    Usuarios.listaUsuariosTipo(datosTipo).then((res)=>{
                        for(var i = 0 ; i < res.length ; i++){
                            const datosTipo = {ci_emisor: emisor, ci_remitente:  res[i].ci, fecha_emisor: fecha, hora_emisor: hora, estado: 'Entregado', mensaje: `Vehiculo con Nro. de Placa ${placa} fue registrado en la cuenta del Usuario ${ci} satisfactoriamente`}
                            Notificaciones.agregarEntregaNotificacion(datosTipo).then((respuesta)=>{
                                const resultado = usuariosConectados.find( iden => iden.ci === datosTipo.ci_remitente );
                                if(typeof resultado != 'undefined'){
                                    io.to(resultado.id).emit('notificacionesRoot', datosTipo)
                                }
                                
                            },(error)=>{
                                console.log(error)
                            })
                        }

                        
                    },(error)=>{
                        console.log(error)
                    })

                    io.emit('actualizaEventoCliente', datos)
                },(error)=>{
                    console.log(error)
                })

                },(error)=>{
                    console.log(error)
                })
                
                io.emit('listaVehiculos', datos)
            },(error)=>{
                console.log(error)
            })

        })

        socket.on('listaMisVehiculos', (ci) => {
            console.log('llego', ci)
            UsuariosVehiculos.listaMisVehiculos(ci).then((res)=>{
                io.emit('listaMisVehiculos', res) 
            }, (error)=>{
                console.log(error)
            })
        })

        socket.on('listaVehiculos', () => {
            Vehiculos.listaVehiculos().then((res)=>{
                io.emit('listaVehiculos', res) 
            }, (error)=>{
                console.log(error)
            })
        })

        socket.on('agregarDispositivo', (datos) => {
            const {fecha, hora} = FechaHora.getFechaHoraActualMysql()
            const { codigo, emisor } = datos

            Dispositivos.agregarDispositivo(datos).then((res)=>{
                Dispositivos.agregarConfiguracionDispositivo(codigo).then((res)=>{
                    const datosRegistroConfiguracionDispositivo = {dispositivo: codigo, ci_emisor: emisor, informe: `Se realizado la configuracion de Dispositivo (${codigo}) correctamente`, fecha: fecha, hora: hora}

                    Dispositivos.agregarRegistroConfiguracionDispositivo(datosRegistroConfiguracionDispositivo).then((res)=>{
                const datosRegistroDispositivo = {dispositivo: codigo, ci_emisor: emisor, informe: `Nuevo dispositivo GPS con codigo (${codigo}) fue registrado satisfactoriamente`, fecha: fecha, hora: hora}
                
                Dispositivos.agregarRegistroDispositivo(datosRegistroDispositivo).then((res)=>{
                    const datosTipo = 'Root_Administrador'

                    Usuarios.listaUsuariosTipo(datosTipo).then((res)=>{
                        for(var i = 0 ; i < res.length ; i++){
                            const datosTipo = {ci_emisor: emisor, ci_remitente:  res[i].ci, fecha_emisor: fecha, hora_emisor: hora, estado: 'Entregado', mensaje: `Nuevo dispositivo GPS con codigo (${codigo}) fue registrado satisfactoriamente`}
                            Notificaciones.agregarEntregaNotificacion(datosTipo).then((respuesta)=>{
                                const resultado = usuariosConectados.find( iden => iden.ci === datosTipo.ci_remitente );
                                if(typeof resultado != 'undefined'){
                                    io.to(resultado.id).emit('notificacionesRoot', datosTipo)
                                }
                                
                            },(error)=>{
                                console.log(error)
                            })
                        }
                    },(error)=>{
                        console.log(error)
                    })

                    io.emit('actualizaEventoCliente', datos)

                },(error)=>{
                    console.log(error)
                })
                io.emit('listaDispositivos', datos)

            },(error)=>{
                console.log(error)
            })
            },(error)=>{
                console.log(error)
            })
            },(error)=>{
                console.log(error)
            })
        })

        socket.on('enlazarVehiculoDispositivo', (datos) => {
            const {fecha, hora} = FechaHora.getFechaHoraActualMysql()
            const { placa, dispositivo, emisor } = datos

            Dispositivos.enlazarVehiculoDispositivo(datos).then((res)=>{
                const datosRegistroDispositivo = {placa: placa, dispositivo: dispositivo, ci_emisor: emisor, informe: `El vehiculo con Nro. de placa: ${placa} fue enlazado con el dispositivo ${dispositivo}`, fecha: fecha, hora: hora}
                
                Dispositivos.agregarRegistrovehiculoDispositivo(datosRegistroDispositivo).then((res)=>{
                    const datosTipo = 'Root_Administrador'

                    Usuarios.listaUsuariosTipo(datosTipo).then((res)=>{
                        for(var i = 0 ; i < res.length ; i++){
                            const datosTipo = {ci_emisor: emisor, ci_remitente:  res[i].ci, fecha_emisor: fecha, hora_emisor: hora, estado: 'Entregado', mensaje: `El vehiculo con Nro. de placa: ${placa} fue enlazado con el dispositivo ${dispositivo}`}
                            Notificaciones.agregarEntregaNotificacion(datosTipo).then((respuesta)=>{
                                const resultado = usuariosConectados.find( iden => iden.ci === datosTipo.ci_remitente );
                                if(typeof resultado != 'undefined'){
                                    io.to(resultado.id).emit('notificacionesRoot', datosTipo)
                                }
                                
                            },(error)=>{
                                console.log(error)
                            })
                        }
                    },(error)=>{
                        console.log(error)
                    })
                },(error)=>{
                    console.log(error)
                })
                io.emit('listaDispositivos', datos)
            }, (error)=>{
                console.log(error)
            })
        })

        socket.on('leerConfiguracionDispositivo', (dispositivo) => {
            Dispositivos.leerConfiguracionDispositivo(dispositivo).then((res)=>{
                io.to(socket.id).emit('leerConfiguracionDispositivo', res) 
            }, (error)=>{
                console.log(error)
            })
        })

        socket.on('actualizarConfiguracionDispositivo', (datos, cb) => {
            Dispositivos.actualizarConfiguracionDispositivo(datos).then((res)=>{
                cb(true)
            }, (error)=>{
                console.log(error)
                cb(false)
            })
        })

        socket.on('LoguinFallido', (misdatos) => {
            
            const {fecha, hora} = FechaHora.getFechaHoraActualMysql()
            const datos = {usuario: misdatos.usuario, pass: misdatos.pass, plataforma: misdatos.plataforma, fecha: fecha, hora: hora}
            Usuarios.agregarLoginFallido(datos).then((res)=>{

            }, (error)=>{
                console.log(error)
            })
        })

        socket.on('Logueado', (misdatos) => {
            const {fecha, hora} = FechaHora.getFechaHoraActualMysql()
            const datos = {usuario: misdatos.usuario, plataforma: misdatos.plataforma, fecha: fecha, hora: hora}
            Usuarios.agregarUsuarioLogueado(datos).then((res)=>{

            }, (error)=>{
                console.log(error)
            })
        })

        socket.on('listaDispositivos', () => {
            Dispositivos.listaDispositivos().then((res)=>{
                io.emit('listaDispositivos', res)
            }, (error)=>{
                console.log(error)
            })
        })

        socket.on('agregarUbicacion', (datos) => {
            const {fecha, hora} = FechaHora.getFechaHoraActualMysql()
            const datosUbicacion =  {latitud: datos.latitud, longitud: datos.longitud, velocidad: datos.velocidad, dispositivo: datos.dispositivo, fecha: fecha, hora: hora}
            Dispositivos.agregarUbicacionDispositivo(datosUbicacion).then((res)=>{
                io.emit('listaActualizarUbicacion', datos) 
            }, (error)=>{
                console.log(error)
            })
        })

        socket.on('listaUbicacion', (datos) => {
            console.log('socket', datos)
            Dispositivos.listaUbicacion(datos.dispositivo).then((res)=>{
                io.to(datos.emisor).emit('listaPrimeraUbicacion', res) 
            }, (error)=>{
                console.log(error)
            })
        })

        socket.on('notificacionesRoot', (ci_remitente) => {
            Notificaciones.listaNotificacionesRoot(ci_remitente).then((res)=>{
                console.log('Usuario pide notificaciones:', socket.id)
                io.to(socket.id).emit('notificacionesRoot', res) 
            }, (error)=>{
                console.log(error)
            })
        })

        socket.on('listaActividades', (ci_remitente) => {
            Notificaciones.listaActividades(ci_remitente).then((res)=>{
                console.log('Usuario pide actividades:', socket.id)
                io.to(socket.id).emit('listaActividades', res) 
            }, (error)=>{
                console.log(error)
            })
        })

        socket.on('verificarSession', (id) => {
            console.log('Session', id)
        })
    })
}
