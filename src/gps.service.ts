import * as fs from 'fs';
import * as serialport from 'serialport';

export class GPSService {
    private pSocket!: SocketIO.Socket;
    private id: any;
    private array: Array<string> = [];
    private index: number = 0;
    private port!: serialport;

    public get socket(): SocketIO.Socket {
        return this.pSocket;
    }

    public set socket(value: SocketIO.Socket) {
        this.pSocket = value;
    }

    constructor() {
        this.id = 0;
        this.port = new serialport('COM29', {
            baudRate: 4800,
            autoOpen: false
        });
        this.port.pipe(new serialport.parsers.Readline({ delimiter: '\r\n' }));
        this.init();
    }

    public init(): void {
        this.openPort();
        this.getSentences();
    }

    public reload(): void {
        this.socket.on('run', (checked: boolean) => {
            this.changeStatus(checked);
        });
        this.socket.on('apply', (port: string) => {
            this.updateSerialPort(port);
        });
    }

    public close(): void {
        this.port.close(err => {
            if (err) {
                console.log(err);
            }
        });
    }

    public openPort(): void {
        this.port.open(err => {
            if (err) {
                console.error("ERROR OPENING PORT");
                return;
            }
            console.log("Port opened");
        });
    }

    public updateSerialPort(port: string): void {
        console.log(port.length);
        if (this.port !== undefined) {
            console.log('Closing port');
            try {
                this.close();
            } catch {
                console.log("Port already closed");
            }
            this.port;
        }

        this.port = new serialport(port, {
            baudRate: 4800,
            autoOpen: false
        });

        this.port.pipe(new serialport.parsers.Readline({ delimiter: '\r\n' }));

        console.log(`Serialport changed to ${port}`);

        this.openPort();
    }

    public changeStatus(run: boolean): void {
        if (run) {
            console.log("Run");
            this.id = setInterval(() => { this.run(); }, 1000);
        } else {
            console.log('Stop');
            clearInterval(this.id);
        }
    }

    public run(): void {
        const msg = this.array[this.index] + "\r\n" + this.array[this.index + 1] + "\r\n" + this.array[this.index + 2] + "\r\n";
        this.port.write(Buffer.from(msg), err => {
            if (err) {
                console.error(err);
                return;
            }
            console.log('Array : ', this.array);
            console.log('MSG:', msg);
            console.log('GPS Data send...');
        });
        this.index +=3;

        if (this.index > this.array.length - 3)
            this.index = 0;
    }

    public getSentences(): void {
        fs.readFile('./outputs/output.nmea', (err, data) => { this.read(err, data) });
    }

    public read(err: NodeJS.ErrnoException, data: Buffer): void {
        if (err) {
            console.log("Error while opening file output.nmea");
            return;
        }
        const content = data.toString("utf-8");
        this.array = content.split("\n");
        console.log('Sentences readed');
    }
}