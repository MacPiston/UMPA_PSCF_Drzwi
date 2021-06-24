#include <Arduino.h>
#include "setup/setup.h"

void setup() {
  setupIO();
  setupWifi();
  setupSocketIO();
  setupBtBeacon();
}

void loop() {
  socketIO.loop();
}