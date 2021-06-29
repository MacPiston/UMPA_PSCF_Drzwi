#include <Arduino.h>
#include "settings.h"

hw_timer_t *blinkTimer = NULL;
portMUX_TYPE blinkerMux = portMUX_INITIALIZER_UNLOCKED;
volatile bool blinkTriggered = false;

void IRAM_ATTR onBlink()
{
    portENTER_CRITICAL_ISR(&blinkerMux);
    blinkTriggered = true;
    portEXIT_CRITICAL_ISR(&blinkerMux);
}

void setupTimers()
{
    blinkTimer = timerBegin(0, 80000, true);
    timerAttachInterrupt(blinkTimer, &onBlink, true);
    timerAlarmWrite(blinkTimer, 100, false);
}
