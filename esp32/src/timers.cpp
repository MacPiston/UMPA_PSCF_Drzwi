#include <Arduino.h>
#include "settings.h"

portMUX_TYPE timerMux = portMUX_INITIALIZER_UNLOCKED;

hw_timer_t *blinkTimer = NULL;
volatile bool blinkTriggered = false;

hw_timer_t *lockTimer = NULL;
volatile bool lockTriggered = false;

void IRAM_ATTR onBlink()
{
    portENTER_CRITICAL_ISR(&timerMux);
    blinkTriggered = true;
    portEXIT_CRITICAL_ISR(&timerMux);
}

void IRAM_ATTR onLock()
{
    portENTER_CRITICAL_ISR(&timerMux);
    lockTriggered = true;
    portEXIT_CRITICAL_ISR(&timerMux);
}

void setupTimers()
{
    blinkTimer = timerBegin(1, 80000, true);
    timerAttachInterrupt(blinkTimer, &onBlink, true);
    timerAlarmWrite(blinkTimer, 100, false);

    lockTimer = timerBegin(0, 80000, true);
    timerAttachInterrupt(lockTimer, &onLock, true);
    timerAlarmWrite(lockTimer, 15000, false);
}
