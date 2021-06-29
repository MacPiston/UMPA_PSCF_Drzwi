#include <Arduino.h>
#include "io.h"
#include "network.h"
#include "socketio.h"
#include "bluetooth.h"

void setup()
{
  setupIO();
  setupNetwork();
  setupSocketIO();
  setupBluetooth();
}

void loop()
{
  socketIO.loop();
}