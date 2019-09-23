import * as express from 'express';
import * as http from 'http';
import * as socketio from 'socket.io';
import * as fs from 'fs';
import { AddressInfo } from 'net';
import { GPSService } from './gps.service';

const app = express();
app.get('/', (req, res) => {
    fs.readFile('./html/index.html', 'utf-8', (error, content) => {
        res.writeHead(200, {"Content-Type": "text/html"});
        res.end(content);
    });
});

// Init http server
const server = http.createServer(app);

// Init GPS Service
const gpsService = new GPSService();

// Init WebSocket
const ws = socketio.listen(server);

ws.sockets.on('connection', (socket: SocketIO.Socket) => {
    gpsService.socket = socket;
    gpsService.reload();
    socket.on('message', (message: string) => {
        console.log('Message received: %s', message);
    });
});

// Start the server
server.listen(process.env.port || 8080, () => {
    const info= server.address() as AddressInfo;
    console.info(`Server started on port ${info.port}`);
});
