#include <Arduino.h>
#include "settings.h"
#include "io.h"
#include "timers.h"
#include "network.h"
#include "socketio.h"
#include "bluetooth.h"

void setup()
{
  setupIO();
  digitalWrite(STATUS_LED, HIGH);
  setupTimers();
  setupNetwork();
  setupSocketIO();
  setupBluetooth();
  digitalWrite(STATUS_LED, LOW);
}

void checkTriggers()
{
  if (lockTriggered)
  {
    lockTriggered = false;
    closeLock();
  }
}

void loop()
{
  checkTriggers();
  socketIO.loop();
}