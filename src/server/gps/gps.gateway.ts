import {
    WebSocketGateway,
    WebSocketServer,
    OnGatewayInit,
    WsResponse,
    SubscribeMessage,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { GPSService } from './gps.service';

const logger = new Logger('GPSGateway', true);

@WebSocketGateway({namespace: 'gps'})
export class GPSGateway implements OnGatewayInit {
    @WebSocketServer() server: SocketIO.Socket;

    constructor(private readonly gpsService: GPSService){}

    public emitGpsData(data: Position): void {
        this.server.emit('gpsData', data);
        this.server.emit('gpsSpeed', data.coords.speed);
    }

    public afterInit(server: any) {
        logger.log('Websocket initialized');
        this.server = server;
    }

    @SubscribeMessage('run')
    onRun(client, data: any): WsResponse<boolean> {
        const event = 'run';
        const value = this.gpsService.changeStatus(data);
        return { event, data: value };
    }
    @SubscribeMessage('apply')
    onApply(client, data: any): WsResponse<boolean> {
        const event = 'apply';
        const value = this.gpsService.updateSerialPort(data);
        return { event, data: value };
    }
}