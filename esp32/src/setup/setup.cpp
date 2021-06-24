#include <NimBLEDevice.h>
#include <NimBLEServer.h>

#include "settings.h"
#include "socketIOhandler.h"

WiFiMulti wifiMulti;
SocketIOclient socketIO;

void setupIO()
{
    Serial.begin(115200);
    Serial.println("Lock startup");

    pinMode(IO_PIN, OUTPUT);
}

void setupWifi()
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

void setupSocketIO()
{
    socketIO.begin(SERVER_IP, 4000, "/socket.io/?EIO=4");
    socketIO.onEvent(socketIOEvent);
}

void setupBtBeacon()
{
    NimBLEDevice::init("");
    NimBLEServer *pServer = NimBLEDevice::createServer();

    NimBLEAdvertising *pAdvertising = pServer->getAdvertising();
    pAdvertising->addServiceUUID(LOCK_UUID);
    pAdvertising->setScanResponse(true);
    pAdvertising->setMinPreferred(0x06);
    pAdvertising->setMinPreferred(0x12);
    NimBLEDevice::startAdvertising();
    Serial.println("Lock beacon enabled - it should be visible by now");
}