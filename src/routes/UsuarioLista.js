import React from 'react';

import {
  Row,
  Col,
  Icon,
  Grid,
  Button,
  Panel,
  Table,
  Form,
  FormControl,
  ControlLabel,
  FormGroup,
  InputGroup,
  PanelBody,
  PanelHeader,
  PanelContainer,
  MenuItem,
  PanelFooter,
  DropdownButton
} from '@sketchpixy/rubix';

const {socket} = require('../sockets')

class AgregarUsuarioVehiculo extends React.Component {
  constructor(){
    super()
    this.state={
      vehiculos: [],
      vehiculo: "",
      usuario: "",
      emisor: localStorage.getItem("Ci_Usuario")
    }
    this.handleRegistrar = this.handleRegistrar.bind(this)
    this.handleCancelar = this.handleCancelar.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }

  componentDidMount() {
    /*const { id } = this.props.params
    console.log('prueba:', id)*/
    Messenger.options = {
      theme: 'flat'
    };
    socket.emit('listaVehiculos', '')
    socket.on('listaVehiculos', (vehiculos) => {
      this.setState({vehiculos: this.state.vehiculos.concat(vehiculos)})
    })
  }

  handleCancelar(){
    this.props.cancelar()
  }
  
  handleRegistrar(){
    fetch(`/api/verificar-usuario-vehiculo/${this.props.ci}/${this.state.vehiculo}`)
	    .then((response) => {
    	  return response.json()
      })
      .then((recurso) => {
        if(recurso.length > 0){
          Messenger().post({
            type: 'error',
            singleton: true,
            message: `ERROR </br> No se puede registrar el vehiculo con Nro. de placa: ${this.state.vehiculo} al usuario con CI: ${this.props.ci} porque ya se encuentra registrado.`,
            showCloseButton: true
          });
        }else{
          const datos = {placa:this.state.vehiculo,ci:this.props.ci,emisor:this.state.emisor}
          socket.emit('agregarUsuarioVehiculo', datos)
          Messenger().post({
            type: 'success',
            singleton: true,
            message: `Vehiculo con Nro. de Placa ${this.state.vehiculo} fue registrado en la cuenta del Usuario CI: ${this.props.ci}`,
            showCloseButton: true
          })
        }
      })
  }

  handleChange(e){
    const { name, value } = e.target
    this.setState({
      [name]: value
    })
  }
    
  render() {
    return (
      <PanelContainer noOverflow>
        <Panel>
          <PanelHeader className='bg-green fg-white'>
            <Grid>
              <Row>
                <Col xs={12}>
                  <h3>Registrar Datos del Vehiculo</h3>
                </Col>
              </Row>
            </Grid>
          </PanelHeader>
          <PanelBody>
            <Grid>
              <Row>
                <Col xs={12}>
                  <Form>
                    <FormGroup controlId='placa_vehiculo'>
                      <ControlLabel>Cedula de Identidad</ControlLabel>
                      <InputGroup>
                        <InputGroup.Addon>
                          <Icon glyph='icon-fontello-user' />
                        </InputGroup.Addon>
                        <FormControl autoFocus type='text' placeholder='Ej. 2365-RAO' name="usuario" onChange={this.handleChange} value={this.props.ci} />
                      </InputGroup>
                    </FormGroup>

                    <FormGroup controlId="combustion_vehiculo">
                      <ControlLabel>Tipo de Vehiculo</ControlLabel>
                      <InputGroup>
                        <InputGroup.Addon>
                          <Icon glyph='icon-fontello-vcard-1' />
                        </InputGroup.Addon>
                        <FormControl componentClass="select" placeholder="select" name="vehiculo" onChange={this.handleChange}>
                        {this.state.vehiculos.map(vehiculo=>
                          <option key={vehiculo.placa} value={vehiculo.placa}>{vehiculo.placa}</option>
                        )}
                        </FormControl>
                      </InputGroup>
                    </FormGroup>
                    
                  </Form>
                </Col>
              </Row>
            </Grid>
          </PanelBody>
          <PanelFooter className='bg-darkgreen45 text-right'>
            <Grid>
              <Row>
                <Col xs={12}>
                  <br/>
                  <div>
                    <Button outlined bsStyle='lightgreen' onClick={this.handleCancelar}>Cancelar</Button>{' '}
                    <Button outlined bsStyle='lightgreen' onClick={this.handleRegistrar}>Registrar</Button>
                  </div>
                  <br/>
                </Col>
              </Row>
            </Grid>
          </PanelFooter>
        </Panel>
      </PanelContainer>
    );
  }
}

export default class UsuarioLista extends React.Component {
  constructor(){
    super()
    this.state = {
      usuarios: [],
      usuarioSel: '',
      funcion: 'lista'
    }
    this.handleAtras = this.handleAtras.bind(this)
    this.handleAgregar = this.handleAgregar.bind(this)
    this.handleEliminar = this.handleEliminar.bind(this)
  }

  componentDidMount() {
    socket.emit('listaUsuarios', '')
    socket.on('listaUsuarios', (usuarios) => {
      this.setState({usuarios: this.state.usuarios.concat(usuarios)})
    })
  }

  handleAtras(){
    this.setState({funcion: 'lista'})
  }

  handleAgregar(e){
    this.setState({funcion: 'agregar'})
    const { name } = e.target
    this.setState({usuarioSel: name})
  }

  handleEliminar(e){
    console.log('CLICK EN ELIMINAR')
  }
  
  render() {
    switch(this.state.funcion) {
      case 'lista':
      return (
        <Row>
          <Col xs={12}>
            <PanelContainer>
              <Panel>
                <PanelBody>
                  <Grid>
                    <Row>
                      <Col xs={12}>
                      <h4 style={{marginTop: 0}}>Lista de Usuarios</h4>
                    <Table striped>
                      <thead>
                        <tr>
                          <th>Cedula de Identidad</th>
                          <th>Nombre(s)</th>
                          <th>Apellido Paterno</th>
                          <th>Apellido Materno</th>
                          <th>Opciones</th>
                        </tr>
                      </thead>
  
                      <tbody>
                        {this.state.usuarios.map(usuario=>
                          <tr key={usuario.ci}>
                            <td>{usuario.ci}</td>
                            <td>{usuario.nombre}</td>
                            <td>{usuario.appat}</td>
                            <td>{usuario.apmat}</td>
                            <td>
                              <DropdownButton title="Opciones" id="bg-nested-dropdown" bsStyle='blue'>
                                <MenuItem eventKey="1" name={usuario.ci} onClick={this.handleAgregar}>Agregar Vehiculo</MenuItem>
                                <MenuItem eventKey="2" name={usuario.ci} onClick={this.handleEliminar}>Eliminar Vehiculo</MenuItem>
                              </DropdownButton>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </Table>
                        <br/>
                      </Col>
                    </Row>
                  </Grid>
                </PanelBody>
              </Panel>
              
            </PanelContainer>
          </Col>
        </Row>
      );
      case 'agregar':
        return <AgregarUsuarioVehiculo ci={this.state.usuarioSel} cancelar={this.handleAtras}/>
      case 'eliminar':
        return <Component2 text = {myObj1.text} key={ key } />
    }
  }
}