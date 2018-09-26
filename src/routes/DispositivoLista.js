import React from 'react';
import { css } from 'emotion';
import { PropagateLoader } from 'react-spinners'
import { Table } from 'react-bootstrap';
import {
  Row,
  Col,
  Icon,
  Grid,
  Panel,
  PanelBody,
  PanelContainer
} from '@sketchpixy/rubix';
const {socket} = require('../sockets')

let datos

class ListaDispositivos extends React.Component {
  constructor(){
    super()
    this.state = {
      dispositivos: [],
      loading: true,
      primeraCarga: false
    }
  }
  componentDidMount() {
    socket.emit('listaDispositivos', '')
    socket.on('listaDispositivos', (dispositivos) => {
      if (this.refs.myRef){
        this.setState({primeraCarga: true})
        this.setState({dispositivos: this.state.dispositivos.concat(dispositivos)})
      }
    })
  }

  render() {
    if(this.state.dispositivos.length > 0){
      datos = this.state.dispositivos.map(dispositivo=>
        <tr key={dispositivo.codigo}>
          <td>{dispositivo.codigo}</td>
          <td>{dispositivo.modelo}</td>
          <td>{dispositivo.imei}</td>
          <td>{dispositivo.nro_sim}</td>
        </tr>)
    }else{
      if(this.state.primeraCarga){
        datos = <tr className='sweet-loading'>
        <td></td>
        <td></td>
        <td><h4 className='fg-black50'><Icon glyph='icon-fontello-attention-5'/>{' '}<span>No se encontro ningun resultado</span></h4></td>
        <td></td>
        <td></td>
      </tr>
      }else{
        datos = <tr className='sweet-loading'>
        <td></td>
        <td></td>
        <td><PropagateLoader className={css`display: block; padding-top: 10px; padding-bottom: 20px; margin-left: auto; margin-right: auto; width: 0%;`} sizeUnit={"px"} size={15} color={'#123abc'} loading={this.state.loading}/></td>
        <td></td>
        <td></td>
      </tr>
      }
    }
    return (
      <Col xs={12} ref="myRef">
        <h4 style={{marginTop: 0}}>Lista de Dispositivos GPS</h4>
        <Table striped hover responsive>
          <thead>
            <tr>
              <th>Codigo</th>
              <th>Modelo</th>
              <th>Imei</th>
              <th>Nro. de Sim</th>
              <th>Opciones</th>
            </tr>
          </thead>
          <tbody>
            {datos}
          </tbody>
        </Table>
      </Col>
    );
  }
}

export default class DispositivoLista extends React.Component {
  render() {
    return (
      <Row>
        <Col xs={12}>
          <PanelContainer>
            <Panel>
              <PanelBody>
                <Grid>
                  <Row>
                    <ListaDispositivos />
                    <br/>
                  </Row>
                </Grid>
              </PanelBody>
            </Panel>
          </PanelContainer>
        </Col>
      </Row>
    );
  }
}
