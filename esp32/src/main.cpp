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

  // openLockTime();
}

void checkTriggers()
{
  if (blinkTriggered)
  {
    blinkTriggered = false;
    ledOff();
  }
  if (lockTriggered)
  {
    Serial.println("lock triggered");
    lockTriggered = false;
    closeLock();
    delay(2000);
  }
}

void loop()
{
  // checkTriggers();
  socketIO.loop();
}