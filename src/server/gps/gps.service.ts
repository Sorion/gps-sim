import * as fs from 'fs';
import * as serialport from 'serialport';
import { Injectable, Logger } from '@nestjs/common';

const logger = new Logger('GPSService', true);

@Injectable()
export class GPSService {
    private id: any;
    private array: Array<string> = [];
    private index: number = 0;
    private port!: serialport;

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

    public close(): void {
        this.port.close(err => {
            if (err) {
                logger.log(err.message);
            }
        });
    }

    public openPort(): boolean {
        try {
            this.port.open(err => {
                if (err) {
                    logger.error('Error while opening port: ' + err.message);
                    return false;
                }
                logger.log('Port opened');
            });
        } catch {
            return false;
        }

        return true;
    }

    public updateSerialPort(port: string): boolean {
        logger.log(port.length.toString());
        if (this.port !== undefined) {
            logger.log('Closing port');
            try {
                this.close();
            } catch {
                logger.log("Port already closed");
                return false;
            }
            this.port;
        }

        this.port = new serialport(port, {
            baudRate: 4800,
            autoOpen: false
        });

        this.port.pipe(new serialport.parsers.Readline({ delimiter: '\r\n' }));

        logger.log(`Serialport changed to ${port}`);

        return this.openPort();
    }

    public changeStatus(run: boolean): boolean {
        if (run) {
            logger.log('Run');
            this.id = setInterval(() => { this.run(); }, 1000);
            return true;
        } else {
            logger.log('Stop');
            clearInterval(this.id);
            return false;
        }
    }

    public run(): void {
        const msg = this.array[this.index] + "\r\n" + this.array[this.index + 1] + "\r\n" + this.array[this.index + 2] + "\r\n";
        this.port.write(Buffer.from(msg), err => {
            if (err) {
                logger.error(err);
                return;
            }
        });
        this.index +=3;

        if (this.index > this.array.length - 3)
            this.index = 0;
    }

    public getSentences(): void {
        logger.log('Get file ' +'../../outputs/output.nmea');
        fs.readFile('./outputs/output.nmea', (err, data) => { this.read(err, data) });
    }

    public read(err: NodeJS.ErrnoException, data: Buffer): void {
        if (err) {
            logger.error("Error while opening file output.nmea", err.message);
            return;
        }
        const content = data.toString("utf-8");
        this.array = content.split("\n");
        logger.log('Sentences readed');
    }
}