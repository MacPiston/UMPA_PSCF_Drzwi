#include <WiFiMulti.h>
#include "settings.h"

WiFiMulti wifiMulti;

void setupNetwork()
{
    wifiMulti.addAP(WIFI_SSID, WIFI_PWD);
    uint8_t counter = 0;
    while (wifiMulti.run() != WL_CONNECTED)
    {
        if (counter == 10)
        {
            Serial.println("Failed to connect WiFi");
            while (true)
            {
            }
        }
        counter++;
        Serial.println("Connecting WiFi...");
        delay(1000);
    }
    Serial.println("WiFi connected");
}