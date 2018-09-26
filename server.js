import path from 'path';
import express from 'express';
import compression from 'compression';
import cookieParser from 'cookie-parser';

import routes from './src/routes';
import { renderHTMLString } from '@sketchpixy/rubix/lib/node/router';
import RubixAssetMiddleware from '@sketchpixy/rubix/lib/node/RubixAssetMiddleware';

const http = require('http')
const socketio = require('socket.io')

const port = process.env.PORT || 8080;

let app = express();
app.use(compression());
app.use(cookieParser());
app.use(express.static(path.join(process.cwd(), 'public')));
app.set('views', path.join(process.cwd(), 'views'));
app.set('view engine', 'pug');

const server = http.createServer(app)
const io = socketio.listen(server)

function renderHTML(req, res) {
  renderHTMLString(routes, req, (error, redirectLocation, html) => {
    if (error) {
      if (error.message === 'Not found') {
        res.status(404).send(error.message);
      } else {
        res.status(500).send(error.message);
      }
    } else if (redirectLocation) {
      res.redirect(302, redirectLocation.pathname + redirectLocation.search);
    } else {
      res.render('index', {
        content: html
      });
    }
  });
}

/** BEGIN X-EDITABLE ROUTES */

app.get('/xeditable/groups', function(req, res) {
  res.send([
    {value: 0, text: 'Guest'},
    {value: 1, text: 'Service'},
    {value: 2, text: 'Customer'},
    {value: 3, text: 'Operator'},
    {value: 4, text: 'Support'},
    {value: 5, text: 'Admin'}
  ]);
});

require('./sockets')(io)

app.use(require('./routes/ruta_usuario'))
app.use(require('./routes/ruta_vehiculo'))
app.use(require('./routes/ruta_dispositivo'))
app.use(require('./routes/ruta_usuario_vehiculo'))
app.get('/xeditable/status', function(req, res) {
  res.status(500).end();
});

app.post('/xeditable/address', function(req, res) {
  res.status(200).end();
});

app.post('/dropzone/file-upload', function(req, res) {
  res.status(200).end();
});

/** END X-EDITABLE ROUTES */

app.post('/dropzone/file-upload', function(req, res) {
  res.status(200).end();
});

app.get('/', RubixAssetMiddleware('app'), (req, res, next) => {
  renderHTML(req, res);
});

app.get('/app/*', RubixAssetMiddleware('app'), (req, res, next) => {
  renderHTML(req, res);
});

server.listen(port, () => {
  console.log(`Node.js app is running at http://localhost:${port}/`);
});
