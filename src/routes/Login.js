import React from 'react';
import { Link, withRouter } from 'react-router';
import { css } from 'emotion';
import { PropagateLoader } from 'react-spinners'
import {
  Row,
  Col,
  Icon,
  Grid,
  Form,
  Badge,
  Panel,
  Button,
  PanelBody,
  FormGroup,
  LoremIpsum,
  InputGroup,
  FormControl,
  ButtonGroup,
  ButtonToolbar,
  PanelContainer,
} from '@sketchpixy/rubix';
const {socket, datosPersonales} = require('../sockets')
let data

@withRouter
export default class Login extends React.Component {
  constructor(){
    super()
    this.state={
      usuario: "",
      pass: "",
      mensaje: "Ingrese su Usuario y Contraseña",
      autentificacion: false,
      loading: true
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleIngresar = this.handleIngresar.bind(this)
  }

  handleChange(e){
    const { name, value } = e.target
    this.setState({
      [name]: value
    })
  }

  handleIngresar(e) {
    e.preventDefault()
    if(this.state.usuario){
      if(this.state.pass){
        this.setState({autentificacion: true})
        this.setState({mensaje: 'Autentificando Usuario y Contraseña . . .'})
        fetch(`/api/autentificacion/${this.state.usuario}/${this.state.pass}`)
	      .then((response) => {
    	    return response.json()
        })
        .then((recurso) => {
          const datos = {usuario: this.state.usuario, pass: this.state.pass, plataforma: 'web'}
          if(recurso.length > 0){
            socket.emit('Autentificacion', recurso[0], data => {
              if(data){
                socket.emit('Logueado', datos)
                datosPersonales.ci = recurso[0].ci
                datosPersonales.ci_exp = recurso[0].ci_exp
                datosPersonales.nombre = `${recurso[0].nombre} ${recurso[0].appat} ${recurso[0].apmat}`
                datosPersonales.imagen = recurso[0].imagen
                datosPersonales.tipo = recurso[0].tipo
                this.props.router.push('/app/misvehiculos')
              }else{
                vex.dialog.alert('El Usuario actualmente se encuentra usado el sistema.');
                this.setState({mensaje: 'El Usuario actualmente se encuentra usado el sistema.'})
                this.setState({autentificacion: false})
                this.setState({usuario: '', pass: ''})
              }
            })
          }else{
            socket.emit('LoguinFallido', datos)
            vex.dialog.alert(`Usuario y/o Contraseña invalido.</br>Vuelva a ingresa su usuario y contraseña.`);
            this.setState({autentificacion: false})
            this.setState({usuario: '', pass: ''})
            this.setState({mensaje: `Vuelva a ingresa su Usuario y Contraseña.`})
          }
        })
      }else{
        vex.dialog.alert('Ingrese su Contraseña para Iniciar Sesion.');
      }
    }else{
      vex.dialog.alert('Ingrese su Usuario para Iniciar Sesion.');
    }
  }

  render() {
    if(this.state.autentificacion)
      data = <PropagateLoader className={css`display: block; padding-top: 10px; padding-bottom: 20px; margin-left: auto; margin-right: auto; width: 0%;`} sizeUnit={"px"} size={15} color={'#123abc'} loading={this.state.loading}/>
    else
      data = <Button outlined lg type='submit' bsStyle='blue' onClick={this.handleIngresar}>Ingresar</Button>
    
      return (
      <div id='auth-container' className='login'>
        <Grid>
          <Row>
            <Col sm={4} smOffset={4} xs={10} xsOffset={1} collapseLeft collapseRight>
              <PanelContainer controls={false}>
                <Panel>
                  <PanelBody style={{padding: 0}}>
                    <div className='text-center bg-darkblue fg-white'>
                      <h3 style={{margin: 0, padding: 25}}>Iniciar Sesion</h3>
                    </div>
                    <div className='bg-hoverblue fg-black50 text-center' style={{padding: 12.5}}>
                      <div>Bienvenido al sistema de rastreo de Vehiculos de ISI BOLIVIA</div>
                        <div style={{marginTop: 12.5, marginBottom: 12.5}}>
                          <a href='#'>
                            <img src='/imgs/app/logoIsiBolivia.png' alt='ISI BOLIVIA' width='340' height='210' />
                          </a>
                        </div>
                      </div>
                    <div>
                      <div className='text-center bg-hoverblue fg-black50'>
                        <h4 className='fg-black50'><Icon glyph='icon-fontello-key-5'/>{' '}<span>{this.state.mensaje}</span></h4>
                      </div>
                      <div style={{padding: 25, paddingTop: 0, paddingBottom: 0, margin: 'auto', marginBottom: 25, marginTop: 25}}>
                        <Form>
                          <FormGroup controlId='emailaddress'>
                            <InputGroup bsSize='large'>
                              <InputGroup.Addon>
                                <Icon glyph='icon-fontello-user' />
                              </InputGroup.Addon>
                              <FormControl autoFocus type='text' className='border-focus-blue' placeholder='Usuario' name="usuario" value={this.state.usuario} onChange={this.handleChange} />
                            </InputGroup>
                          </FormGroup>
                          <FormGroup controlId='password'>
                            <InputGroup bsSize='large'>
                              <InputGroup.Addon>
                                <Icon glyph='icon-fontello-key' />
                              </InputGroup.Addon>
                              <FormControl type='password' className='border-focus-blue' placeholder='Contraseña' name="pass" value={this.state.pass} onChange={this.handleChange}/>
                            </InputGroup>
                          </FormGroup>
                          <FormGroup>
                            <Grid>
                              <Row>
                                <Col xs={12} className='text-center'>{data}</Col>
                              </Row>
                            </Grid>
                          </FormGroup>
                        </Form>
                      </div>
                    </div>
                  </PanelBody>
                </Panel>
              </PanelContainer>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}
