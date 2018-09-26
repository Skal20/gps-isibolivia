import React from 'react';

import {
  Row,
  Col,
  Grid,
  Form,
  Panel,
  Button,
  FormGroup,
  PanelBody,
  InputGroup,
  FormControl,
  PanelHeader,
  PanelContainer,
} from '@sketchpixy/rubix';
const {socket} = require('../sockets')

class MapContainer extends React.Component {
  render() {
    return (
      <PanelContainer>
        <Panel>
          <PanelBody style={{padding: 25}}>
            <h4 className='text-center' style={{marginTop: 0}}>{this.props.name}</h4>
            {this.props.children}
            <div id={this.props.id} style={{height: 300}}></div>
          </PanelBody>
        </Panel>
      </PanelContainer>
    );
  }
}

export default class Maps extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      LatLon:[]
    };
  }

  componentDidMount() {
    console.log('EMPIEZO:', this.props.vehiculos)
    var map1, map2
    var path = []

    map1 = new GMaps({
      scrollwheel: false,
      div: '#markers',
      zoom: 16,
      lat: -16.495678,
      lng: -68.133516
    })

    map2 = new GMaps({
      scrollwheel: false,
      div: '#polyline',
      zoom: 16,
      lat: -16.495678,
      lng: -68.133516
    })

    for(let i = 0 ; i < this.props.vehiculos.length ; i++){
      let  datos = { dispositivo: this.props.vehiculos[i].dispositivo, emisor: socket.id }
      socket.emit('listaUbicacion', datos)
      socket.on('listaPrimeraUbicacion', (ubicacion) => {
        this.setState({LatLon: this.state.LatLon.concat(ubicacion)})
  
        for(var i = 0 ; i < this.state.LatLon.length ; i++){
          map1.addMarker({
            icon: "/imgs/app/1.png",
            lat: this.state.LatLon[i].latitud,
            lng: this.state.LatLon[i].longitud,
            title: `velocidad: ${this.state.LatLon[i].velocidad} km/h`,
            infoWindow: {
              content: `<p>velocidad: ${this.state.LatLon[i].velocidad} km/h</p>`
            }
          })
          var ruta = [this.state.LatLon[i].latitud, this.state.LatLon[i].longitud]
          path = path.concat([ruta])
        }
        map1.setCenter(this.state.LatLon[this.state.LatLon.length -1].latitud, this.state.LatLon[this.state.LatLon.length -1].longitud)
  
        map2.drawPolyline({
          //icon: "/imgs/app/github.png",
          path: path,
          strokeColor: '#FF0080',
          strokeOpacity: 0.75,
          strokeWeight: 8
        })
      })
    }

    socket.on('listaActualizarUbicacion', (ubicacion) => {
      this.setState({LatLon: this.state.LatLon.concat(ubicacion)})
      console.log('cantidad:', this.state.LatLon.length)

      map1.addMarker({
        lat: ubicacion.latitud,
        lng: ubicacion.longitud,
        title: `velocidad: ${ubicacion.velocidad} km/h`,
        infoWindow: {
          content: `<p>velocidad: ${ubicacion.velocidad} km/h</p>`
        }
      })
      map1.setCenter(ubicacion.latitud, ubicacion.longitud)
      path = path.concat([[ubicacion.latitud, ubicacion.longitud]])

      map2.drawPolyline({
        path: path,
        strokeColor: '#FF0080',
        strokeOpacity: 0.75,
        strokeWeight: 8
      })
    })
  }

  handleSubmit(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  startRouting(e) {
    e.preventDefault();
    e.stopPropagation();
    this.setState({
      routeslist: []
    }, () => {
      var map = this.routingmap;
      var list = [];
      map.travelRoute({
        origin: [-12.044012922866312, -77.02470665341184],
        destination: [-12.090814532191756, -77.02271108990476],
        travelMode: 'driving',
        step: (e) => {
          list.push({
            instructions: e.instructions,
            lat: e.end_location.lat(),
            lng: e.end_location.lng(),
            path: e.path
          });
        },
        end: (e) => {
          var lat, lng, path;
          var processList = (i) => {
            if(list.length === i) return;
            lat = list[i].lat;
            lng = list[i].lng;
            path = list[i].path;
            setTimeout(() => {
              this.setState({
                routeslist: list.slice(0, i+1)
              });
              map.setCenter(lat, lng);
              map.drawPolyline({
                path: path,
                strokeColor: '#FF6FCF',
                strokeWeight: 8
              });
              processList(i+1);
            }, 500);
          };
          processList(0);
        }
      });
    });
  }

  render() {
    return (
      <div>
        <Row>
          <Col sm={12}>
            <MapContainer id='markers' name='Map Markers' />
          </Col>
          <Col sm={12}>
            <MapContainer id='polyline' name='Polylines' />
          </Col>
        </Row>
      </div>
    );
  }
}

