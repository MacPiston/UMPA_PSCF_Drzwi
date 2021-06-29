#include <Arduino.h>
#include "settings.h"

void setupIO()
{
    Serial.begin(115200);
    Serial.println("Lock startup");

    pinMode(STATUS_LED, OUTPUT);
    pinMode(BUTTON, INPUT_PULLUP);
}