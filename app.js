var http = require('http');
var fs = require('fs');
var Serialport = require('serialport');

var parser = new Serialport.parsers.Readline({ delimiter: '\r\n' });

// Chargement du fichier index.html affiché au client
var server = http.createServer(function(req, res) {
    fs.readFile('./html/index.html', 'utf-8', function(error, content) {
        res.writeHead(200, {"Content-Type": "text/html"});
        res.end(content);
    });
});

// Chargement de serialport
var port = new Serialport('COM29', {
    baudRate: 4800,
    autoOpen: false
});

port.pipe(parser);

port.open(function(err) {
    if (err) {
        console.error("ERROR OPENING PORT");
        return;
    }
    console.log("Port opened");
    // Chargement du Fichier
var content;
fs.readFile('./outputs/output.nmea', function read(err, data){
    if (err) {
        console.log("Error while opening file output.nmea");
        return;
    }

    content = data.toString("utf-8");
    array = content.split("\n");

    var index = 0;
    console.log('Starting sending data');
    setInterval(function(){
        var msg = array[index] + "\r\n" + array[index + 1] + "\r\n" + array[index + 2] + "\r\n";
        port.write(Buffer.from(msg), function(err){
            if (err)
                console.error(err);
        });
        index +=3;

        if (index > array.length - 3)
            index = 0;
    }, 1000);
});
})



 

// Chargement de socket.io
var io = require('socket.io').listen(server);

// Quand un client se connecte, on le note dans la console
io.sockets.on('connection', function (socket) {
    console.log('Un client est connecté !');

    socket.on('run', function (checked) {
        console.log('Run', checked);
    });

    socket.on('speed', function (value) {
        console.log('Speed', value);
    });
});


server.listen(8080);
