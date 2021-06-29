#ifndef TIMERS_H_
#define TIMERS_H_
#include <Arduino.h>

extern portMUX_TYPE timerMux;

extern hw_timer_t *blinkTimer;
extern volatile bool blinkTriggered;

extern hw_timer_t *lockTimer;
extern volatile bool lockTriggered;

void setupTimers();

#endif