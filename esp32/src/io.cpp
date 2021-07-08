#include <Arduino.h>
#include "settings.h"
#include "timers.h"

void setupIO()
{
    Serial.begin(115200);
    Serial.println("Lock startup");

    pinMode(STATUS_LED, OUTPUT);
    pinMode(LOCK_PIN, OUTPUT);
    pinMode(BUTTON, INPUT_PULLUP);
}

void ledOn()
{
    digitalWrite(STATUS_LED, HIGH);
}

void ledOff()
{
    digitalWrite(STATUS_LED, LOW);
}

void openLock()
{
    digitalWrite(LOCK_PIN, HIGH);
}

void closeLock()
{
    digitalWrite(LOCK_PIN, LOW);
}

void openLockTime()
{
    openLock();
    timerAlarmWrite(lockTimer, 10000000, false);
    timerWrite(lockTimer, 0);
    timerAlarmEnable(lockTimer);
}
