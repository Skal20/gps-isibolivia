import React from 'react';

import {
  Sidebar, SidebarNav, SidebarNavItem,
  SidebarControls, SidebarControlBtn,
  LoremIpsum, Grid, Row, Col, FormControl,
  Label, Progress, Icon,
  SidebarDivider
} from '@sketchpixy/rubix';

import { Link, withRouter } from 'react-router';

import ChatComponent from './chat';
import StatisticsComponent from './statistics';
import TimelineComponent from './timeline';
import NotificationsComponent from './notifications';
const {socket, datosPersonales} = require('../sockets')


@withRouter
class ApplicationSidebar extends React.Component {
  handleChange(e) {
    this._nav.search(e.target.value);
  }

  getPath(path) {
    var dir = 'app'
    path = `/${dir}/${path}`;
    return path;
  }

  render() {
    return (
      <div>
        <Grid>
          <Row>
            <Col xs={12}>
              <div className='sidebar-nav-container'>
                <SidebarNav style={{marginBottom: 0}} ref={(c) => this._nav = c}>
                  { /** Pages Section */ }
                  <div className='sidebar-header'>SISTEMA</div>
                  <SidebarNavItem glyph='icon-fontello-gauge' name='Mis Vehiculos' href={this.getPath('misvehiculos')} />
                  <SidebarNavItem glyph='icon-feather-mail' name='Mis Rutas'>
                    <SidebarNav>
                      <SidebarNavItem glyph='icon-feather-inbox' name='Lista de Rutas' href={this.getPath('misruta/lista')} />
                      <SidebarNavItem glyph='icon-feather-inbox' name='Guardar Nueva Ruta' href={this.getPath('misruta/eliminar')} />
                    </SidebarNav>
                  </SidebarNavItem>
                  <SidebarNavItem glyph='icon-feather-mail' name='Rutas Temporales'>
                    <SidebarNav>
                      <SidebarNavItem glyph='icon-feather-inbox' name='Lista de Rutas' href={this.getPath('rutatemp/lista')} />
                      <SidebarNavItem glyph='icon-feather-inbox' name='Eliminar Ruta' href={this.getPath('rutatemp/agregar')} />
                    </SidebarNav>
                  </SidebarNavItem>
                  <SidebarNavItem glyph='icon-feather-mail' name='Usuarios'>
                    <SidebarNav>
                      <SidebarNavItem glyph='icon-feather-inbox' name='Lista' href={this.getPath('usuario/lista')} />
                      <SidebarNavItem glyph='icon-feather-inbox' name='Agregar' href={this.getPath('usuario/agregar')} />
                      <SidebarNavItem glyph='icon-outlined-mail-open' name='Editar' href={this.getPath('usuario/editar')} />
                      <SidebarNavItem glyph='icon-dripicons-message' name='Eliminar' href={this.getPath('usuario/eliminar')} />
                    </SidebarNav>
                  </SidebarNavItem>
                  <SidebarNavItem glyph='icon-feather-mail' name='Vehiculos'>
                    <SidebarNav>
                      <SidebarNavItem glyph='icon-feather-inbox' name='Lista' href={this.getPath('vehiculo/lista')} />
                      <SidebarNavItem glyph='icon-feather-inbox' name='Agregar' href={this.getPath('vehiculo/agregar')} />
                    </SidebarNav>
                  </SidebarNavItem>
                  <SidebarNavItem glyph='icon-feather-mail' name='Dispositivos'>
                    <SidebarNav>
                      <SidebarNavItem glyph='icon-feather-inbox' name='Lista' href={this.getPath('dispositivo/lista')} />
                      <SidebarNavItem glyph='icon-feather-inbox' name='Agregar' href={this.getPath('dispositivo/agregar')} />
                    </SidebarNav>
                  </SidebarNavItem>
                </SidebarNav>
                <br />
                <br />
                <br />
              </div>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

class DummySidebar extends React.Component {
  render() {
    return (
      <Grid>
        <Row>
          <Col xs={12}>
            <div className='sidebar-header'>DUMMY SIDEBAR</div>
            <LoremIpsum query='1p' />
          </Col>
        </Row>
      </Grid>
    );
  }
}

@withRouter
export default class SidebarContainer extends React.Component {
  getPath(path) {
    var dir = 'app'
    path = `/${dir}/${path}`;
    return path;
  }

  componentDidMount(){
    //setTimeout(()=>{
      socket.emit('verificarUsuario', datosPersonales.id, datos => {
        if(datos){

        }else{
          this.props.router.push('/')
        }
    })
   // }, 2000)
    
  }

  render() {
    return (
      <div id='sidebar'>
        <div id='avatar'>
          <Grid>
            <Row className='fg-white'>
              <Col xs={4} collapseRight>
                <img src={`/imgs/app/usuarios/${datosPersonales.imagen}`} width='40' height='40' />
              </Col>
              <Col xs={8} collapseLeft id='avatar-col'>
                <div style={{top: 23, fontSize: 16, lineHeight: 1, position: 'relative'}}>{datosPersonales.nombre}</div>
                <div>
                  <Progress id='demo-progress' value={30} color='#ffffff'/>
                  <Link to={this.getPath('lock')}>
                    <Icon id='demo-icon' bundle='fontello' glyph='lock-5' />
                  </Link>
                </div>
              </Col>
            </Row>
          </Grid>
        </div>
        <SidebarControls>
          <SidebarControlBtn bundle='fontello' glyph='docs' sidebar={0} />
          <SidebarControlBtn bundle='fontello' glyph='chat-1' sidebar={1} />
          <SidebarControlBtn bundle='fontello' glyph='chart-pie-2' sidebar={2} />
          <SidebarControlBtn bundle='fontello' glyph='th-list-2' sidebar={3} />
          <SidebarControlBtn bundle='fontello' glyph='bell-5' sidebar={4} />
        </SidebarControls>
        <div id='sidebar-container'>
          <Sidebar sidebar={0}>
            <ApplicationSidebar />
          </Sidebar>
          <Sidebar sidebar={1}>
            <ChatComponent />
          </Sidebar>
          <Sidebar sidebar={2}>
            <StatisticsComponent />
          </Sidebar>
          <Sidebar sidebar={3}>
            <TimelineComponent />
          </Sidebar>
          <Sidebar sidebar={4}>
            <NotificationsComponent />
          </Sidebar>
        </div>
      </div>
    );
  }
}
