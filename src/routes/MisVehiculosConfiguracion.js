import React from 'react';

import {
  Row,
  Col,
  Nav,
  Grid,
  Icon,
  Form,
  Panel,
  Radio,
  Button,
  MenuItem,
  Checkbox,
  HelpBlock,
  PanelBody,
  FormGroup,
  InputGroup,
  SplitButton,
  PanelHeader,
  ButtonGroup,
  FormControl,
  PanelFooter,
  ControlLabel,
  DropdownButton,
  PanelContainer,
} from '@sketchpixy/rubix';
const {socket, datosPersonales} = require('../sockets')

export default class MisVehiculosConfiguracion extends React.Component {
  constructor(){
    super()
    this.state = {
      numero_uno: "",
      numero_dos: "",
      numero_tres: "",
      sensor_puerta: false,
      boton_seguridad: false,
      rastreo_tiempo_real: false,
      bloqueo_motor: false,
      alerta_bocina: false,
      modelo: "",
      imei: "",
      nro_sim: "",
      emisor: datosPersonales.ci
    }

    this.handleActualizar = this.handleActualizar.bind(this)
    this.handleChangeFormulario = this.handleChangeFormulario.bind(this)
    this.handleChangeFormularioChecked = this.handleChangeFormularioChecked.bind(this)
  }

  componentDidMount() {
    socket.emit('leerConfiguracionDispositivo', this.props.dispositivo)
    socket.on('leerConfiguracionDispositivo', (configuracion) => {
      if (this.refs.myRef) {
        this.setState({numero_uno: configuracion[0].numero_uno})
        this.setState({numero_dos: configuracion[0].numero_dos})
        this.setState({numero_tres: configuracion[0].numero_tres})
        this.setState({sensor_puerta: configuracion[0].sensor_puerta})
        this.setState({boton_seguridad: configuracion[0].boton_seguridad})
        this.setState({rastreo_tiempo_real: configuracion[0].rastreo_tiempo_real})
        this.setState({bloqueo_motor: configuracion[0].bloqueo_motor})
        this.setState({alerta_bocina: configuracion[0].alerta_bocina})
      }
    })
    Messenger.options = {
      theme: 'flat'
    };
  }

  handleChangeFormulario(e){
    let {name, value } = e.target
    this.setState({[name]: value})
  }

  handleChangeFormularioChecked(e){
    const {name, checked } = e.target
    this.setState({
      [name]: checked
    })
  }

  handleActualizar(){
    const datos = {codigo: this.props.dispositivo, numero_uno: this.state.numero_uno, numero_dos: this.state.numero_dos, numero_tres: this.state.numero_tres, sensor_puerta: this.state.sensor_puerta, boton_seguridad: this.state.boton_seguridad, rastreo_tiempo_real: this.state.rastreo_tiempo_real, bloqueo_motor: this.state.bloqueo_motor, alerta_bocina: this.state.alerta_bocina}
    socket.emit('actualizarConfiguracionDispositivo', datos, verificacion =>{
      if(verificacion){
        Messenger().post({
          type: 'success',
          singleton: true,
          message: `Su configuracion fue actualizada con exito`,
          showCloseButton: true
        })
      }else{
        Messenger().post({
          type: 'error',
          singleton: true,
          message: `ERROR </br> No se puede configurar este dispositivo`,
          showCloseButton: true
        });
      }
    })
  }
  render() {
    return (
      <PanelContainer ref="myRef" noOverflow >
        <Panel>
          <PanelHeader className='bg-green fg-white'>
            <Grid>
              <Row>
                <Col xs={12}>
                  <h3>Registrar Dispositivo GPS</h3>
                </Col>
              </Row>
            </Grid>
          </PanelHeader>
          <PanelBody>
            <Grid>
              <Row>
                <Col xs={12}>
                  <Form>
                    <FormGroup controlId='sim_dispositivo'>
                      <ControlLabel>Numero 1</ControlLabel>
                      <InputGroup>
                        <InputGroup.Addon>
                          <Icon glyph='icon-fontello-user' />
                        </InputGroup.Addon>
                        <FormControl type='number' placeholder='Numero Uno' name='numero_uno' onChange={this.handleChangeFormulario} value={this.state.numero_uno}/>
                      </InputGroup>
                    </FormGroup>

                    <FormGroup controlId='sim_dispositivo'>
                      <ControlLabel>Numero 2</ControlLabel>
                      <InputGroup>
                        <InputGroup.Addon>
                          <Icon glyph='icon-fontello-user' />
                        </InputGroup.Addon>
                        <FormControl type='number' placeholder='Numero Dos' name='numero_dos' onChange={this.handleChangeFormulario} value={this.state.numero_dos}/>
                      </InputGroup>
                    </FormGroup>

                    <FormGroup controlId='sim_dispositivo'>
                      <ControlLabel>Numero 3</ControlLabel>
                      <InputGroup>
                        <InputGroup.Addon>
                          <Icon glyph='icon-fontello-user' />
                        </InputGroup.Addon>
                        <FormControl type='number' placeholder='Numero Tres' name='numero_tres' onChange={this.handleChangeFormulario} value={this.state.numero_tres}/>
                      </InputGroup>
                    </FormGroup>

                    <FormGroup>
                      <Checkbox name='sensor_puerta' onChange={this.handleChangeFormularioChecked} checked={this.state.sensor_puerta}>Sensor de Puertas</Checkbox>
                      <Checkbox name='boton_seguridad' onChange={this.handleChangeFormularioChecked} checked={this.state.boton_seguridad}>Boton de Seguridad</Checkbox>
                      <Checkbox name='rastreo_tiempo_real' onChange={this.handleChangeFormularioChecked} checked={this.state.rastreo_tiempo_real}>Rastreo en tiempo Real</Checkbox>
                      <Checkbox name='bloqueo_motor' onChange={this.handleChangeFormularioChecked} checked={this.state.bloqueo_motor}>Bloqueo de Motor</Checkbox>
                      <Checkbox name='alerta_bocina' onChange={this.handleChangeFormularioChecked} checked={this.state.alerta_bocina}>Alerta de Bocina</Checkbox>
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
                    <Button outlined bsStyle='lightgreen'>Cancelar</Button>{' '}
                    <Button outlined bsStyle='lightgreen' onClick={this.handleActualizar}>Actualizar Configuracion</Button>
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
