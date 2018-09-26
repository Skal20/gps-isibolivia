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

const {socket} = require('../sockets')

class DefaultForm extends React.Component {
  constructor(){
    super()
    this.state={
      vehiculos: [],
      vehiculo: "",
      usuario: ""
    }
    this.handleRegistrar = this.handleRegistrar.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }

  componentDidMount() {
    const { id } = this.props.params
    console.log('prueba:', id)
    Messenger.options = {
      theme: 'flat'
    };
    socket.emit('listaVehiculos', '')
    socket.on('listaVehiculos', (vehiculos) => {
      this.setState({vehiculos: this.state.vehiculos.concat(vehiculos)})
    })
  }

  handleRegistrar(){

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
                      <ControlLabel>Nro. de Placa</ControlLabel>
                      <InputGroup>
                        <InputGroup.Addon>
                          <Icon glyph='icon-fontello-user' />
                        </InputGroup.Addon>
                        <FormControl autoFocus type='text' placeholder='Ej. 2365-RAO' name="placa" onChange={this.handleChange} />
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

export default class UsuarioVehiculoAgregar extends React.Component {
  render() {
    return (
      <Row>
        <Col sm={6} collapse>
          <DefaultForm />
        </Col>
      </Row>
    );
  }
}