#include <Arduino.h>
#include "settings.h"

portMUX_TYPE timerMux = portMUX_INITIALIZER_UNLOCKED;

hw_timer_t *lockTimer = NULL;
volatile bool lockTriggered = false;

void IRAM_ATTR onLock()
{
    portENTER_CRITICAL_ISR(&timerMux);
    lockTriggered = true;
    portEXIT_CRITICAL_ISR(&timerMux);
}

void setupTimers()
{
    lockTimer = timerBegin(0, 80, true);
    timerAttachInterrupt(lockTimer, &onLock, true);
}
