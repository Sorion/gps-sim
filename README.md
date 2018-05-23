# Gps Simulator

## Introduction

Gps Simulator is a simple nodejs gps simaultor that send nmea sentences (GGA, GSA, RMC) through a serial port.
It has been design to work as a virual test gps devices for your app that receive nmea data trhough serial port

In this case you will need additional tools depending on your operating system.

## Install deps

### Windows

On windows you will need com0com. It's a serial port emulator for windows.
It create virtual port that can be paired together to simulate the input and output of a device.
In our case we can create and paired `COM29` & `COM30` port.
`COM29` port will be the output of the gps simulator & `COM30` will be the port where data are received in your own app.

You can find here com0com [here](https://sourceforge.net/projects/com0com/).

### Linux based

On Linux you will need a very similar tools called tty0tty. Basically it does the same thing as com0com on windows.
You don't need to pair port as pair are automatic.

tty0tty will create port in `dev/tnt*` (0, 1, 2, etc...)
port tnt0 and tnt1 will be automatically paired.

#### install tty0tty

to install tty0tty0 on linux follow these commands

```bash
git clone https://github.com/freemed/tty0tty
cd tty0tty/module
sudo make
sudo cp tty0tty.ko /lib/modules/$(uname -r)/kernel/drivers/misc/
sudo depmod
sudo modprobe tty0tty
```

## Installation

You need nodejs to run this app.

Once need is installed clone this repo.

If your are on windows find the line in app.js that contains `COM29` and replace it with your desired port.

On linux do the same with `/dev/tnt*` (replace `*` par the port number)

Then run

```node
node app.js
```

## Known bugs

* On linux the very fist message to write will failed but others are ok.