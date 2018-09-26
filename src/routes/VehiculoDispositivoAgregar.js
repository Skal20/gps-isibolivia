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

export default class VehiculoDispositivoAgregar extends React.Component {
    constructor(){
      super()
      this.state={
        dispositivos: [],
        dispositivo: "",
        emisor: localStorage.getItem("Ci_Usuario")
      }
      this.handleRegistrar = this.handleRegistrar.bind(this)
      this.handleCancelar = this.handleCancelar.bind(this)
      this.handleChange = this.handleChange.bind(this)
    }
  
    componentDidMount() {
      Messenger.options = {
        theme: 'flat'
      };
      socket.emit('listaDispositivos', '')
      socket.on('listaDispositivos', (dispositivos) => {
        this.setState({dispositivos: this.state.dispositivos.concat(dispositivos)})
      })
    }
  
    handleCancelar(){
      this.props.cancelar()
    }
    handleRegistrar(){
        const datos = {placa:this.props.vehiculo, dispositivo:this.state.dispositivo,emisor:this.state.emisor}
        console.log(datos)
        socket.emit('enlazarVehiculoDispositivo', datos)
        Messenger().post({
            type: 'success',
            singleton: true,
            message: `Dispositivo (${this.state.dispositivo}) enlazado con el Vehiculo:${this.props.vehiculo}`,
            showCloseButton: true
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
                    <h3>Enlazar Dispositivo con Vehiculo</h3>
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
                        <ControlLabel>Vehiculo</ControlLabel>
                        <InputGroup>
                          <InputGroup.Addon>
                            <Icon glyph='icon-fontello-user' />
                          </InputGroup.Addon>
                          <FormControl autoFocus type='text' placeholder='Ej. 2365-RAO' name="vehiculo" onChange={this.handleChange} value={this.props.vehiculo}/>
                        </InputGroup>
                      </FormGroup>
  
                      <FormGroup controlId="combustion_vehiculo">
                        <ControlLabel>Dispositivo</ControlLabel>
                        <InputGroup>
                          <InputGroup.Addon>
                            <Icon glyph='icon-fontello-vcard-1' />
                          </InputGroup.Addon>
                          <FormControl componentClass="select" placeholder="select" name="dispositivo" onChange={this.handleChange}>
                          {this.state.dispositivos.map(dispositivo=>
                            <option key={dispositivo.codigo} value={dispositivo.codigo}>{dispositivo.codigo}</option>
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
                      <Button outlined bsStyle='lightgreen' onClick={this.handleCancelar}>Cancelar</Button>
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