import React from 'react';

import {
  Row,
  Col,
  Grid,
  Icon,
  Form,
  Panel,
  Button,
  PanelBody,
  FormGroup,
  InputGroup,
  PanelHeader,
  FormControl,
  PanelFooter,
  ControlLabel,
  PanelContainer
} from '@sketchpixy/rubix';
//const socket = require('../sockets')

class DefaultForm extends React.Component {
  constructor(){
    super()
    this.state = {
      ci: "",
      ci_exp: "",
      nombre: "",
      appat: "",
      apmat: "",
      email:"",
      telefono: "",
      tipo: "",
      imagen: "sin_imagen_usuario.jpg"
    }

    this.handleRegistrar = this.handleRegistrar.bind(this)
    this.handleChangeFormulario = this.handleChangeFormulario.bind(this)
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

  handleRegistrar(){
    fetch(`/api/verificar-usuario-ci/${this.state.ci}`)
	    .then((response) => {
    	  return response.json()
      })
      .then((recurso) => {
        if(recurso.length > 0){
          Messenger().post({
            type: 'error',
            singleton: true,
            message: `ERROR </br> No se puede registrar al usuario con CI: ${this.state.ci} porque ya tiene una cuenta en el Sistema.`,
            showCloseButton: true
          });
        }else{
          /*socket.emit('agregarUsuario', this.state)
          Messenger().post({
            type: 'success',
            singleton: true,
            message: `${this.state.nombre.toUpperCase()} ${this.state.appat.toUpperCase()} ${this.state.apmat.toUpperCase()} con Cedula de Identidad ${this.state.ci} ${this.state.ci_exp.toUpperCase()} </br> fue registrado como nuevo Usuario.`,
            showCloseButton: true
          });*/
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
                  <h3>Registrar Datos del Usuario</h3>
                </Col>
              </Row>
            </Grid>
          </PanelHeader>
          <PanelBody>
            <Grid>
              <Row>
                <Col xs={12}>
                  <Form>
                    <FormGroup controlId='ci_usuario'>
                      <ControlLabel>Cedula de Identidad</ControlLabel>
                      <InputGroup>
                        <InputGroup.Addon>
                          <Icon glyph='icon-fontello-vcard-1' />
                        </InputGroup.Addon>
                        <FormControl autoFocus type='number' placeholder='Cedula de Identidad' name="ci" onChange={this.handleChangeFormulario}/>
                      </InputGroup>
                    </FormGroup>

                    <FormGroup controlId="ci_exp_usuario">
                      <ControlLabel>Expedicion de C.I.</ControlLabel>
                      <InputGroup>
                        <InputGroup.Addon>
                          <Icon glyph='icon-fontello-vcard-1' />
                        </InputGroup.Addon>
                        <FormControl componentClass="select" placeholder="select" name="ci_exp" onChange={this.handleChangeFormulario}>
                          <option value='BN'>Beni</option>
                          <option value='CB'>Cochabamba</option>
                          <option value='CH'>Chuquisaca</option>
                          <option value='LP'>La Paz</option>
                          <option value='OR'>Oruro</option>
                          <option value='PA'>Pando</option>
                          <option value='PT'>Potosi</option>
                          <option value='SC'>Santa Cruz</option>
                          <option value='TJ'>Tarija</option>
                        </FormControl>
                      </InputGroup>
                    </FormGroup>

                    <FormGroup controlId='nombre_usuario'>
                      <ControlLabel>Nombre (s)</ControlLabel>
                      <InputGroup>
                        <InputGroup.Addon>
                          <Icon glyph='icon-fontello-user' />
                        </InputGroup.Addon>
                        <FormControl type='text' placeholder='Nombre (s)' name="nombre" onChange={this.handleChangeFormulario} />
                      </InputGroup>
                    </FormGroup>

                    <FormGroup controlId='appat_usuario'>
                      <ControlLabel>Apellido Paterno</ControlLabel>
                      <InputGroup>
                        <InputGroup.Addon>
                          <Icon glyph='icon-fontello-user' />
                        </InputGroup.Addon>
                        <FormControl type='text' placeholder='Apellido Paterno' name="appat" onChange={this.handleChangeFormulario}/>
                      </InputGroup>
                    </FormGroup>

                    <FormGroup controlId='apmat_usuario'>
                      <ControlLabel>Apellido Materno</ControlLabel>
                      <InputGroup>
                        <InputGroup.Addon>
                          <Icon glyph='icon-fontello-user' />
                        </InputGroup.Addon>
                        <FormControl type='text' placeholder='Apellido Materno' name="apmat" onChange={this.handleChangeFormulario}/>
                      </InputGroup>
                    </FormGroup>

                    <FormGroup controlId='email_usuario'>
                      <ControlLabel>Correo Electronico</ControlLabel>
                      <InputGroup>
                        <InputGroup.Addon>
                          <Icon glyph='icon-fontello-at-2' />
                        </InputGroup.Addon>
                        <FormControl type='email' placeholder='Correo Electronico' name="email" onChange={this.handleChangeFormulario}/>
                      </InputGroup>
                    </FormGroup>

                    <FormGroup controlId='telefono_usuario'>
                      <ControlLabel>Telefono Movil</ControlLabel>
                      <InputGroup>
                        <InputGroup.Addon>
                          <Icon glyph='icon-fontello-mobile-alt' />
                        </InputGroup.Addon>
                        <FormControl type='number' placeholder='Telefono Movil' name="telefono" onChange={this.handleChangeFormulario}/>
                      </InputGroup>
                    </FormGroup>

                    <FormGroup controlId="tipo_usuario">
                      <ControlLabel>Tipo de Cuenta</ControlLabel>
                      <InputGroup>
                        <InputGroup.Addon>
                          <Icon glyph='icon-fontello-vcard-1' />
                        </InputGroup.Addon>
                        <FormControl componentClass="select" placeholder="select" name="tipo" onChange={this.handleChangeFormulario}>
                          <option value='Root_Administrador'>Root Administrador</option>
                          <option value='Administrador'>Administrador</option>
                          <option value='Usuario'>Usuario</option>
                        </FormControl>
                      </InputGroup>
                    </FormGroup>


                    <FormGroup controlId='pass_usuario'>
                      <ControlLabel>Password</ControlLabel>
                      <InputGroup>
                        <InputGroup.Addon>
                          <Icon glyph='icon-fontello-key' />
                        </InputGroup.Addon>
                        <FormControl type='password' placeholder='Contraseña' name="password" onChange={this.handleChangeFormulario}/>
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

export default class UsuarioAgregar extends React.Component {
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
