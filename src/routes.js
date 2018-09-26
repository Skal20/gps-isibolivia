import React from 'react';
import classNames from 'classnames';
import { IndexRoute, Route } from 'react-router';
import { CookiesProvider } from 'react-cookie';

import { Grid, Row, Col, MainContainer } from '@sketchpixy/rubix';

/* Common Components */

import Sidebar from './common/sidebar';
import Header from './common/header';
import Footer from './common/footer';

/* Pages */
import Login from './routes/Login';

// MI SISTEMA
import MisVehiculos from './routes/MisVehiculos';
import UsuarioLista from './routes/UsuarioLista';
import UsuarioAgregar from './routes/UsuarioAgregar';
import UsuarioEditar from './routes/UsuarioEditar';
import VehiculoLista from './routes/VehiculoLista';
import VehiculoAgregar from './routes/VehiculoAgregar';
import DispositivoLista from './routes/DispositivoLista';
import DispositivoAgregar from './routes/DispositivoAgregar';
import RastreoVehicular from './routes/RastreoVehicular';
import UsuarioVehiculoAgregar from './routes/UsuarioVehiculoAgregar';

class App extends React.Component {
  
  render() {
    return (
      <MainContainer {...this.props}>
        <Sidebar />
        <Header />
        <div id='body'>
          <Grid>
            <Row>
              <Col xs={12}>
                {this.props.children}
              </Col>
            </Row>
          </Grid>
        </div>
        <Footer />
      </MainContainer>
    );
  }
}

/**
 * Includes Sidebar, Header and Footer.
 */
const routes = (
  <Route component={App}>
    <Route path='misvehiculos' component={MisVehiculos} />
    <Route path='misruta/lista' component={MisVehiculos} />
    <Route path='misruta/eliminar' component={MisVehiculos} />
    <Route path='rutatemp/lista' component={MisVehiculos} />
    <Route path='rutatemp/agregar' component={MisVehiculos} />
    <Route path='usuario/lista' component={UsuarioLista} />
    <Route path='usuario/agregar' component={UsuarioAgregar} />
    <Route path='usuario/editar' component={UsuarioEditar} />
    <Route path='usuario/eliminar' component={MisVehiculos} />
    <Route path='vehiculo/lista' component={VehiculoLista} />
    <Route path='vehiculo/agregar' component={VehiculoAgregar} />
    <Route path='dispositivo/lista' component={DispositivoLista} />
    <Route path='dispositivo/agregar' component={DispositivoAgregar} />
    <Route path='rastreovehicular' component={RastreoVehicular} />
    <Route path='usuariovehiculoagregar/:id' component={UsuarioVehiculoAgregar} />

  </Route>
);

/**
 * No Sidebar, Header or Footer. Only the Body is rendered.
 */
const basicRoutes = (
  <Route>
    <Route path='login' component={Login} />
  </Route>
);

const combinedRoutes = (
  <Route>
    <Route>
      {routes}
    </Route>
    <Route>
      {basicRoutes}
    </Route>
  </Route>
);

export default (

  <Route>
    <Route path='/' component={Login} />
    <Route path='/app'>
      {combinedRoutes}
    </Route>
  </Route>

);
