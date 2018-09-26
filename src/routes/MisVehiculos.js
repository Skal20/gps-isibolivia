import React from 'react';
import { css } from 'emotion';
import { PropagateLoader } from 'react-spinners'
import {
  Row,
  Col,
  Grid,
  Button,
  Checkbox,
  Panel,
  PanelBody,
  PanelContainer,
  MenuItem,
  DropdownButton,
  PanelHeader,
  ButtonGroup,
  FormGroup
} from '@sketchpixy/rubix';
import { Table } from 'react-bootstrap';
const { socket, datosPersonales} = require('../sockets')
import RastreoVehicular from './RastreoVehicular'
import MisVehiculosConfiguracion from './MisVehiculosConfiguracion'
let datos

class ListaMisVehiculos extends React.Component {
  constructor(){
    super()
    this.state = {
      vehiculos: [],
      vehiculosSelec: [],
      loading: true,
      primeraCarga: false
    }

    this.handleBotonConfiguracion = this.handleBotonConfiguracion.bind(this)
    this.handleBotonIniciarRastreo = this.handleBotonIniciarRastreo.bind(this)
    this.handleSeleccionarVehiculo = this.handleSeleccionarVehiculo.bind(this)
  }

  componentDidMount() {
    socket.emit('listaMisVehiculos', datosPersonales.ci)
    socket.on('listaMisVehiculos', (listaVehiculos) => {
      if (this.refs.myRef) {
        this.setState({primeraCarga: false})
        this.setState({vehiculos: this.state.vehiculos.concat(listaVehiculos)})
      }
    })
  }

  handleSeleccionarVehiculo(e){
    const { name, checked } = e.target
    const index = this.state.vehiculos.findIndex(lista => lista.placa === name);
    this.state.vehiculos[index].checked = checked
    this.setState({vehiculos: this.state.vehiculos})

    
    const result = this.state.vehiculos.filter(lista => lista.checked == true);
    this.setState({vehiculosSelec: result})
  }

  handleBotonConfiguracion(e){
    const {name} = e.target
    this.props.configuracion(name)
  }

  handleBotonIniciarRastreo(){
    this.props.rastreo(this.state.vehiculosSelec)
  }

  render() {
    if(this.state.vehiculos.length > 0){
      datos = this.state.vehiculos.map(vehiculo=>
        <tr key={vehiculo.placa}>
          <td style={{paddingLeft: '20px'}}><FormGroup><Checkbox name={vehiculo.placa} defaultValue='option1' onChange={this.handleSeleccionarVehiculo}></Checkbox></FormGroup></td>
          <td style={{paddingTop: '20px'}}>{vehiculo.placa}</td>
          <td style={{paddingTop: '20px'}}>{vehiculo.marca} {vehiculo.serie}</td>
          <td style={{paddingTop: '20px'}}>{vehiculo.modelo}</td>
          <td style={{paddingTop: '20px'}}><div className='text-center'>
            <Button outlined bsStyle='darkblue'>Rastreo Particular</Button>
            <Button outlined bsStyle='darkblue' name={vehiculo.dispositivo} onClick={this.handleBotonConfiguracion}>Configuracion</Button>
            <Button outlined bsStyle='darkblue'>Datos del Vehiculo</Button>
          </div></td>
        </tr>
      )
    }else{
      if(this.state.primeraCarga){
        datos = <tr className='sweet-loading'>
        <td></td>
        <td></td>
        <td><h4 className='fg-black50'><Icon glyph='icon-fontello-attention-5'/>{' '}<span>No se encontro ningun resultado</span></h4></td>
        <td></td>
        <td></td>
      </tr>
      }else{
        datos = <tr className='sweet-loading'>
        <td></td>
        <td></td>
        <td><PropagateLoader className={css`display: block; padding-top: 10px; padding-bottom: 20px; margin-left: auto; margin-right: auto; width: 0%;`} sizeUnit={"px"} size={15} color={'#123abc'} loading={this.state.loading}/></td>
        <td></td>
        <td></td>
      </tr>
      }
    }
    return (
      <PanelContainer ref="myRef" noOverflow>
        <Panel>
          <PanelHeader className='bg-darkorange fg-white'>
            <Grid>
              <Row>
                <Col xs={12}>
                  <h3>Lista de Vehiculos</h3>
                </Col>
              </Row>
            </Grid>
          </PanelHeader>
          <PanelBody style={{padding: 0}}>
            <Grid>
              <Row>
                <Col xs={12} className='text-center'>
                  <div>
                    <Table striped hover responsive >
                      <thead>
                        <tr>
                          <th></th>
                          <th>Nro. de Placa</th>
                          <th>Vehiculo</th>
                          <th>Modelo</th>
                          <th>Opciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {datos}
                      </tbody>
                    </Table>
                  </div>
                  <br/>
                  {this.state.vehiculosSelec.length} vehiculos en la lista <Button outlined style={{marginBottom: 5}} bsStyle='success' onClick={this.handleBotonIniciarRastreo}>Iniciar Rastreo</Button>
                </Col>
              </Row>
            </Grid>
          </PanelBody>
        </Panel>
      </PanelContainer>
    );
  }
}

export default class MisVehiculos extends React.Component {
  constructor(){
    super()
    this.state = {
      funcion: 'lista',
      dispositivo: '',
      vehiculos: []
    }
    this.handleConfiguracion = this.handleConfiguracion.bind(this)
    this.handleIniciarRastreo = this.handleIniciarRastreo.bind(this)
  }

  handleConfiguracion(dispositivo){
    this.setState({dispositivo: dispositivo})
    this.setState({funcion: 'configuracion'})
  }

  handleIniciarRastreo(vehiculos){
    this.setState({funcion: 'rastreo'})
    this.setState({vehiculos: vehiculos})
  }

  render(){
    switch(this.state.funcion) {
      case 'lista':
        return(
          <ListaMisVehiculos rastreo={this.handleIniciarRastreo} configuracion={this.handleConfiguracion}/>
        )
      case 'rastreo':
        return(
          <RastreoVehicular vehiculos={this.state.vehiculos}/>
        )
      case 'configuracion':
        return(
          <MisVehiculosConfiguracion dispositivo={this.state.dispositivo}/>
        )
    }
  }
}
