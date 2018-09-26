import React from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';

import { Link, withRouter } from 'react-router';

import l20n, { Entity } from '@sketchpixy/rubix/lib/L20n';

import {
  LoremIpsum,
  Label,
  SidebarBtn,
  Dispatcher,
  NavDropdown,
  NavDropdownHover,
  Navbar,
  Nav,
  NavItem,
  MenuItem,
  Badge,
  Button,
  Icon,
  Grid,
  Row,
  Radio,
  Col } from '@sketchpixy/rubix';

const { socket, datosPersonales } = require('../sockets')

class Brand extends React.Component {
  render() {
    return (
      <Navbar.Header {...this.props}>
        <Navbar.Brand tabIndex='-1'>
          <a href='#'>
            <img src='/imgs/common/logo.png' alt='ISI BOLIVIA' width='111' height='28' />
          </a>
        </Navbar.Brand>
      </Navbar.Header>
    );
  }
}

class CommitChart extends React.Component {
  componentDidMount() {
    var chart = new Rubix('#commit-column-chart', {
        width: '100%',
        height: 100,
        hideAxisAndGrid: true,
        hideLegend: true,
        tooltip: {
          color: '#2EB398'
        },
        margin: {
          top: 25,
          bottom: 25
        }
    });

    var alerts = chart.column_series({
        name: 'Commits',
        color: '#2EB398'
    });

    alerts.addData([
        {x: 10, y: 20},
        {x: 11, y: 50},
        {x: 12, y: 35},
        {x: 13, y: 30},
        {x: 14, y: 20},
        {x: 15, y: 25},
        {x: 16, y: 30},
        {x: 17, y: 50},
        {x: 18, y: 20},
        {x: 19, y: 30},
        {x: 20, y: 50},
        {x: 21, y: 20},
        {x: 22, y: 50},
        {x: 23, y: 35},
        {x: 24, y: 30},
        {x: 25, y: 20},
        {x: 26, y: 30}
    ]);

    $(window).trigger('resize');
  }
  render() {
    return (
      <Grid style={{marginBottom: -10}}>
        <Row>
          <Col xs={12}>
            <div id='commit-column-chart'></div>
          </Col>
        </Row>
      </Grid>
    );
  }
}

class LtrRtlLayout extends React.Component {
  state = {
    ltr: true
  };

  handleLayoutRadioChange(e) {
    var dir = e.target.value;
    var location = window.location.href;
    if (dir === 'ltr') {
      location = location.replace('rtl', dir);
    } else {
      location = location.replace('ltr', dir);
    }

    window.location.href = location;
  }
  componentDidMount() {
    if($('html').attr('dir') === 'ltr') {
      this.setState({ ltr: true });
    } else {
      this.setState({ ltr: false });
    }
  }
  render() {
    let { ltr } = this.state;
    return (
      <Grid>
        <Row>
          <Col xs={6}>
            <Radio ref='ltr' value='ltr' name='switch-layout' checked={ltr} onChange={this.handleLayoutRadioChange}>
              LTR
            </Radio>
          </Col>
          <Col xs={6} className='text-right'>
            <Radio ref='rtl' value='rtl' name='switch-layout' checked={!ltr} onChange={this.handleLayoutRadioChange}>
              RTL
            </Radio>
          </Col>
        </Row>
      </Grid>
    );
  }
}


class BodyLayout extends React.Component {
  state = {
    fixedLayout: true
  };

  bodyLayoutRadioChange(value) {
    if(!value) return;
    if(value === 'fixed-body') {
      $('html').removeClass('static');
      localStorage.setItem('bodyLayout', 'fixed-body');
      Dispatcher.publish('sidebar:reinitialize');
      this.setState({ fixedLayout: true });
    } else if(value === 'static-body') {
      $('html').addClass('static');
      localStorage.setItem('bodyLayout', 'static-body');
      Dispatcher.publish('sidebar:destroy');
      this.setState({ fixedLayout: false });
    }
  }
  handleBodyLayoutRadioChange(e) {
    this.bodyLayoutRadioChange(e.target.value);
  }
  componentDidMount() {
    this.bodyLayoutRadioChange(localStorage.getItem('bodyLayout'));
  }
  render() {
    let { fixedLayout } = this.state;

    return (
      <Grid>
        <Row>
          <Col xs={8}>
            <Radio ref='fixed-body' value='fixed-body' name='switch-body-layout' checked={fixedLayout} onChange={this.handleBodyLayoutRadioChange}>
              Fixed (Header + Sidebar)
            </Radio>
          </Col>
          <Col xs={4} className='text-right'>
            <Radio ref='static-body' value='static-body' name='switch-body-layout' checked={!fixedLayout} onChange={this.handleBodyLayoutRadioChange}>
              Static
            </Radio>
          </Col>
        </Row>
      </Grid>
    );
  }
}

class SettingsMenu extends React.Component {
  state = {
    fluidLayout: false
  };

  handleViewportChange(eventKey) {
    if (eventKey === 'fluid') {
      localStorage.setItem('settingsMenu', 'fluid');
      $('html').removeClass('boxed');
      this.setState({ fluidLayout: true })
    } else {
      localStorage.setItem('settingsMenu', 'boxed');
      $('html').addClass('boxed');
      this.setState({ fluidLayout: false })
    }
    setTimeout(() => {
      $(window).trigger('resize');
    }, 300);
  }

  componentDidMount() {
    let item = localStorage.getItem('settingsMenu') || 'fluid';
    localStorage.setItem('settingsMenu', item);

    this.handleViewportChange(item);
  }

  render() {
    const cogIcon = (
      <Icon bundle='fontello' glyph='cog-7' style={{position: 'relative', top: 2}} />
    );

    let { fluidLayout } = this.state;

    return (
      <NavDropdown noCaret eventKey={4} title={cogIcon} id='settings-menu' className='header-menu small-font collapse-left' onSelect={this.handleViewportChange}>
        <MenuItem eventKey='dimension' header>
          <Entity entity='settingsMenuHeading' defaultValue='dimension' />
        </MenuItem>
        <MenuItem eventKey='fluid' active={fluidLayout}>
          <Entity entity='settingsMenuFluid' defaultValue='Flui<d' />
        </MenuItem>
        <MenuItem >
          <Entity entity='settingsMenuFluid' defaultValue='Flui<d' />
        </MenuItem>
        <MenuItem eventKey='boxed' active={!fluidLayout}>
          <Entity entity='settingsMenuBoxed' defaultValue='Boxedas (990px)' />
        </MenuItem>
        <MenuItem eventKey='layout' header>
          Layout
        </MenuItem>
        <MenuItem eventKey='ltrRtlLayout' noHover>
          <LtrRtlLayout />
        </MenuItem>
        <MenuItem eventKey='bodyLayoutHeading' header>
          Cuerpo Layout
        </MenuItem>
        <MenuItem eventKey='bodyLayout' noHover>
          <BodyLayout />
        </MenuItem>
      </NavDropdown>
    );
  }
}

class NotificationsMenu extends React.Component {
  constructor(){
    super()
    this.state = {
      notificacionesRoot: []
    }
  }

  componentDidMount() {
    socket.emit('notificacionesRoot', datosPersonales.ci)
    socket.on('notificacionesRoot', (notificacion) => {
      this.setState({notificacionesRoot: this.state.notificacionesRoot.concat(notificacion)})
    })
  }

  render() {
    const bullhornIcon = (
      <span>
        <Icon bundle='fontello' glyph='bullhorn' />
        <Badge className='fg-darkbrown bg-orange notification-badge'>{this.state.notificacionesRoot.length}</Badge>
      </span>
    );

    return (
      <NavDropdown noCaret eventKey={6} title={bullhornIcon} id='notifications-menu' className='header-menu collapse-left'>
        <MenuItem header>NOTIFICACIONES</MenuItem>
        {this.state.notificacionesRoot.map(notificacion=>
        <MenuItem href='#' key={notificacion.codigo}>
          <Grid>
            <Row>
              <Col xs={2} className='avatar-container' collapseRight>
                <div><img src='/imgs/app/avatars/avatar22.png' width='40' height='40' alt='sarah_patchett' /></div>
                <div className='text-center'>
                  <Label bsStyle='info'>NUEVO</Label>
                </div>
              </Col>
              <Col xs={10} className='notification-container' collapseLeft collapseRight>
                <div className='time'>
                  <strong className='fg-darkgray50'><Icon bundle='fontello' glyph='chat-5'/><em>{notificacion.fecha_emisor} {notificacion.hora_emisor}</em></strong>
                </div>
                <div className='message-header'>
                  <strong className='fg-darkgreen45'>{notificacion.ci_emisor}</strong>
                </div>
                <div className='message-details fg-text'>
                  <span>{notificacion.mensaje}</span>
                </div>
              </Col>
            </Row>
          </Grid>
        </MenuItem>
        )}
        <MenuItem noHover>
          <Grid style={{marginBottom: -10}}>
            <Row>
              <Col xs={6} collapseLeft collapseRight>
                <Button block className='notification-footer-btn left-btn'>MARK ALL READ</Button>
              </Col>
              <Col xs={6} collapseLeft collapseRight>
                <Button block className='notification-footer-btn right-btn'>VIEW ALL</Button>
              </Col>
            </Row>
          </Grid>
        </MenuItem>
      </NavDropdown>
    );
  }
}

class ActividadesCliente extends React.Component {
  constructor(){
    super()
    this.state = {
      listaActividades: []
    }
  }

  componentDidMount() {
    socket.emit('listaActividades', datosPersonales.ci)
    socket.on('listaActividades', (actividad) => {
      this.setState({listaActividades: this.state.listaActividades.concat(actividad)})
    })
  }

  render() {
    const rssfeedIcon = (
      <span>
        <Icon bundle='fontello' glyph='rss-1' />
        <Badge className='fg-darkgreen bg-darkgreen40 notification-badge'>{this.state.listaActividades.length}</Badge>
      </span>
    );

    return (
      <NavDropdown noCaret eventKey={7} title={rssfeedIcon} id='rss-menu' className='header-menu collapse-left'>
        <MenuItem header>Actividades Recientes</MenuItem>
        <MenuItem href='#'>
          <Grid>
            {this.state.listaActividades.map(actividad=>
            <Row key={actividad.codigo}>
              <Col xs={2}>
                <Icon glyph='icon-fontello-ok-6'/>
              </Col>
              <Col xs={10} collapseLeft className='notification-container' style={{width: 265}}>
                <div className='time'>
                  <strong className='fg-darkgray50'><em>{actividad.fecha}-{actividad.hora}</em></strong>
                </div>
                <div className='message-header fg-darkgray50'>
                  <strong className='fg-darkgreen45'>Plataforma {actividad.plataforma}</strong>
                </div>
                <div className='message-details fg-text'>
                  {actividad.mensaje}
                </div>
              </Col>
            </Row>
            )}
          </Grid>
        </MenuItem>
      </NavDropdown>
    )
  }
}

@withRouter
class HeaderNavigation extends React.Component {
  handleSkinSwitch(e) {
    e.preventDefault();
    e.stopPropagation();
    var vexContent;
    vex.open({
      afterOpen: ($vexContent) => {
        vexContent = $vexContent;
        return ReactDOM.render(<Skins id={$vexContent.data().vex.id} />, $vexContent.get(0));
      },
      afterClose: () => {
        ReactDOM.unmountComponentAtNode(vexContent.get(0));
      }
    });
  }

  handleLogout(e) {
    this.props.router.push('/');
  }

  getPath(path) {
    var dir = this.props.location.pathname.search('rtl') !== -1 ? 'rtl' : 'ltr';
    path = `/${dir}/${path}`;
    return path;
  }

  render() {
    return (
      <Nav pullRight>
        <Nav className='hidden-xs'>
          <NotificationsMenu style={{lineHeight: 1, fontSize: 24, top: 2, position: 'relative' }} />
          <ActividadesCliente style={{lineHeight: 1, fontSize: 24, top: 2, position: 'relative' }} />
          <SettingsMenu style={{lineHeight: 1, fontSize: 24, top: 2, position: 'relative' }} />
        </Nav>
        <Nav>
          <NavItem className='logout' href='#' onClick={this.handleLogout}>
            <Icon bundle='fontello' glyph='off-1' />
          </NavItem>
        </Nav>
      </Nav>
    );
  }
}

export default class Header extends React.Component {
  render() {
    return (
      <Grid id='navbar' {...this.props}>
        <Row>
          <Col xs={12}>
            <Navbar fixedTop fluid id='rubix-nav-header'>
              <Row>
                <Col xs={3} visible='xs'>
                  <SidebarBtn />
                </Col>
                <Col xs={6} sm={4}>
                  <Brand />
                </Col>
                <Col xs={3} sm={8} collapseRight className='text-right'>
                  <HeaderNavigation />
                </Col>
              </Row>
            </Navbar>
          </Col>
        </Row>
      </Grid>
    );
  }
}
