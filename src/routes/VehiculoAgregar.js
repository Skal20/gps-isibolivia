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
      placa: "",
      marca: "",
      serie: "",
      modelo: "",
      combustion: "",
      imagen: "sin_imagen_vehiculo.jpg",
      emisor: localStorage.getItem("Ci_Usuario")
    }
    this.handleRegistrar = this.handleRegistrar.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }

  componentDidMount() {
    Messenger.options = {
      theme: 'flat'
    };
  }

  handleRegistrar(){
    fetch(`/api/verificar-vehiculo-placa/${this.state.placa}`)
	    .then((response) => {
    	  return response.json()
      })
      .then((recurso) => {
        if(recurso.length > 0){
          Messenger().post({
            type: 'error',
            singleton: true,
            message: `ERROR </br> No se puede registrar el vehiculo con Nro. de Placa: ${this.state.ci} .Ya se encuentra registrado`,
            showCloseButton: true
          });
        }else{
          socket.emit('agregarVehiculo', this.state)
          Messenger().post({
            type: 'success',
            singleton: true,
            message: `Vehiculo ${this.state.marca.toUpperCase()} ${this.state.serie.toUpperCase()} del año ${this.state.modelo.toUpperCase()} con numero de placa: ${this.state.placa} </br> fue registrado satisfactoriamente en el sistema`,
            showCloseButton: true
          });
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
                      <ControlLabel>Nro. de Placa</ControlLabel>
                      <InputGroup>
                        <InputGroup.Addon>
                          <Icon glyph='icon-fontello-user' />
                        </InputGroup.Addon>
                        <FormControl autoFocus type='text' placeholder='Ej. 2365-RAO' name="placa" onChange={this.handleChange} />
                      </InputGroup>
                    </FormGroup>

                    <FormGroup controlId='marca_vehiculo'>
                      <ControlLabel>Marca</ControlLabel>
                      <InputGroup>
                        <InputGroup.Addon>
                          <Icon glyph='icon-fontello-user' />
                        </InputGroup.Addon>
                        <FormControl type='text' placeholder='Ej. Suzuki' name="marca" onChange={this.handleChange}/>
                      </InputGroup>
                    </FormGroup>

                    <FormGroup controlId='serie_vehiculo'>
                      <ControlLabel>Serie</ControlLabel>
                      <InputGroup>
                        <InputGroup.Addon>
                          <Icon glyph='icon-fontello-user' />
                        </InputGroup.Addon>
                        <FormControl type='text' placeholder='Ej. Grand Vitara' name="serie" onChange={this.handleChange} />
                      </InputGroup>
                    </FormGroup>

                    <FormGroup controlId='modelo_vehiculo'>
                      <ControlLabel>Modelo</ControlLabel>
                      <InputGroup>
                        <InputGroup.Addon>
                          <Icon glyph='icon-fontello-vcard-1' />
                        </InputGroup.Addon>
                        <FormControl type='number' placeholder='2012' name="modelo" onChange={this.handleChange}/>
                      </InputGroup>
                    </FormGroup>

                    <FormGroup controlId="combustion_vehiculo">
                      <ControlLabel>Tipo de Vehiculo</ControlLabel>
                      <InputGroup>
                        <InputGroup.Addon>
                          <Icon glyph='icon-fontello-vcard-1' />
                        </InputGroup.Addon>
                        <FormControl componentClass="select" placeholder="select" name="combustion" onChange={this.handleChange}>
                          <option value='Carburador'>Carburador</option>
                          <option value='Inyeccion'>Inyeccion</option>
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

export default class VehiculoAgregar extends React.Component {
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
