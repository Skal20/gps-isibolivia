import React from 'react';

import {
  Row,
  Col,
  Grid,
  Panel,
  Table,
  PanelBody,
  PanelContainer,
  MenuItem,
  DropdownButton
} from '@sketchpixy/rubix';

import VehiculoDispositivoAgregar from './VehiculoDispositivoAgregar'
const {socket} = require('../sockets')

class ListaVehiculos extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      vehiculos: [],
      vehiculoSel: ''
    }
    
  }

  componentDidMount() {
    socket.emit('listaVehiculos', '')
    socket.on('listaVehiculos', (vehiculos) => {
      if (this.refs.myRef) 
        this.setState({vehiculos: this.state.vehiculos.concat(vehiculos)})
    })
  }

  handleAgregar(vehiculo){
    this.props.enlazar(vehiculo)
  }

  render() {
    return (
      <PanelContainer ref="myRef">
        <Panel>
          <PanelBody>
            <Grid>
              <Row>
                <Col xs={12}>
                  <h4 style={{marginTop: 0}}>Lista de Vehiculos</h4>
                  <Table striped>
                    <thead>
                      <tr>
                        <th>Nro. de Placa</th>
                        <th>Vehiculo</th>
                        <th>Modelo</th>
                        <th>Estado Actual</th>
                        <th>Opciones</th>
                      </tr>
                    </thead>

                    <tbody>
                      {this.state.vehiculos.map(vehiculo=>
                        <tr key={vehiculo.placa}>
                          <td>{vehiculo.placa}</td>
                          <td>{vehiculo.marca} {vehiculo.serie}</td>
                          <td>{vehiculo.modelo}</td>
                          <td></td>
                          <td>
                            <DropdownButton title="Opciones" id="bg-nested-dropdown" bsStyle='blue'>
                              <MenuItem eventKey="1" >Informacion Completa</MenuItem>
                              <MenuItem eventKey="2" name={vehiculo.placa} onClick={() => this.handleAgregar(vehiculo.placa)}>Enlazar con Dispositivo</MenuItem>
                              <MenuItem eventKey="3">Eliminar Dispositivo</MenuItem>
                              <MenuItem eventKey="4">Opciones de Dispositivo</MenuItem>
                            </DropdownButton>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </Table>
                </Col>
              </Row>
            </Grid>
          </PanelBody>
        </Panel>
      </PanelContainer>
    );
  }
}

export default class VehiculoLista extends React.Component {
  constructor (){
    super()
    this.state =  {
      vehiculo: '',
      funcion: 'lista'
    }
    this.handleEnlazar = this.handleEnlazar.bind(this)
    this.handleCancelar = this.handleCancelar.bind(this)
  }

  handleEnlazar(vehiculo){
    this.setState({funcion: 'agregar'})
    this.setState({vehiculo: vehiculo})
  }

  handleCancelar(){
    this.setState({funcion: 'lista'})
    this.setState({vehiculo: ''})
  }

  render() {
    switch(this.state.funcion) {
      case 'lista':
        return (
          <Row>
            <Col xs={12}>
              <ListaVehiculos enlazar={this.handleEnlazar}/>
            </Col>
          </Row>
        );
      case 'agregar':
        return (
          <Row>
            <Col xs={12}>
              <VehiculoDispositivoAgregar vehiculo={this.state.vehiculo} cancelar={this.handleCancelar}/>
            </Col>
          </Row>
        );
    }
  }
}
