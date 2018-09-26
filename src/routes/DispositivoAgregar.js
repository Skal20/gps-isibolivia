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

class DefaultForm extends React.Component {
  constructor(){
    super()
    this.state = {
      codigo: "",
      modelo: "",
      imei: "",
      nro_sim: "",
      sensor_puerta: false,
      boton_seguridad: false,
      rastreo_tiempo_real: false,
      bloqueo_motor: false,
      alerta_bocina: false,
      emisor: datosPersonales.ci
    }

    this.handleRegistrar = this.handleRegistrar.bind(this)
    this.handleChangeFormulario = this.handleChangeFormulario.bind(this)
    this.handleChangeFormularioChecked = this.handleChangeFormularioChecked.bind(this)
  }

  componentDidMount() {
    Messenger.options = {
      theme: 'flat'
    };
  }

  handleChangeFormulario(e){
    const {name, value } = e.target
    this.setState({
      [name]: value
    })
  }

  handleChangeFormularioChecked(e){
    const {name, checked } = e.target
    this.setState({
      [name]: checked
    })
  }

  handleRegistrar(){
    fetch(`/api/verificar-dispositivo-codigo/${this.state.codigo}`)
	    .then((response) => {
    	  return response.json()
      })
      .then((recurso) => {
        if(recurso.length > 0){
          Messenger().post({
            type: 'error',
            singleton: true,
            message: `ERROR </br> No se puede registrar el dispositivo con CODIGO: ${this.state.codigo}, porque ya se encuentra registrado.`,
            showCloseButton: true
          });
        }else{
          socket.emit('agregarDispositivo', this.state)
          Messenger().post({
            type: 'success',
            singleton: true,
            message: `Dispositivo GPS modelo ${this.state.modelo.toUpperCase()} con CODIGO: ${this.state.codigo} </br> fue registradoe el sistema.`,
            showCloseButton: true
          });
        }
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
                    <FormGroup controlId='codigo_dispositivo'>
                      <ControlLabel>Codigo</ControlLabel>
                      <InputGroup>
                        <InputGroup.Addon>
                          <Icon glyph='icon-fontello-user' />
                        </InputGroup.Addon>
                        <FormControl autoFocus type='text' placeholder='Ej. 02530' name='codigo' onChange={this.handleChangeFormulario}/>
                      </InputGroup>
                    </FormGroup>

                    <FormGroup controlId='modelo_dispositivo'>
                      <ControlLabel>Modelo</ControlLabel>
                      <InputGroup>
                        <InputGroup.Addon>
                          <Icon glyph='icon-fontello-user' />
                        </InputGroup.Addon>
                        <FormControl type='text' placeholder='Ej. Suzuki' name='modelo' onChange={this.handleChangeFormulario}/>
                      </InputGroup>
                    </FormGroup>

                    <FormGroup controlId='imei_dispositivo'>
                      <ControlLabel>Imei</ControlLabel>
                      <InputGroup>
                        <InputGroup.Addon>
                          <Icon glyph='icon-fontello-user' />
                        </InputGroup.Addon>
                        <FormControl type='number' placeholder='Ej. Suzuki' name='imei' onChange={this.handleChangeFormulario}/>
                      </InputGroup>
                    </FormGroup>

                    <FormGroup controlId='sim_dispositivo'>
                      <ControlLabel>Numero de Sim</ControlLabel>
                      <InputGroup>
                        <InputGroup.Addon>
                          <Icon glyph='icon-fontello-user' />
                        </InputGroup.Addon>
                        <FormControl type='number' placeholder='Ej. Suzuki' name='nro_sim' onChange={this.handleChangeFormulario}/>
                      </InputGroup>
                    </FormGroup>

                    <FormGroup>
                      <Checkbox name='sensor_puerta' onChange={this.handleChangeFormularioChecked}>Sensor de Puertas</Checkbox>
                      <Checkbox name='boton_seguridad' onChange={this.handleChangeFormularioChecked}>Boton de Seguridad</Checkbox>
                      <Checkbox name='rastreo_tiempo_real' onChange={this.handleChangeFormularioChecked}>Rastreo en tiempo Real</Checkbox>
                      <Checkbox name='bloqueo_motor' onChange={this.handleChangeFormularioChecked}>Bloqueo de Motor</Checkbox>
                      <Checkbox name='alerta_bocina' onChange={this.handleChangeFormularioChecked}>Alerta de Bocina</Checkbox>
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

export default class DispositivoAgregar extends React.Component {
  render() {
    return (
      <Row>
        <Col sm={12}>
          <DefaultForm />
        </Col>
      </Row>
    );
  }
}
