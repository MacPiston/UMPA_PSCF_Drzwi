#ifndef TIMERS_H_
#define TIMERS_H_
#include <Arduino.h>

extern hw_timer_t *blinkTimer;
extern portMUX_TYPE blinkerMux;
extern volatile bool blinkTriggered;
void setupTimers();

#endif