#include <Arduino.h>
#include <NimBLEDevice.h>
#include <NimBLEServer.h>
#include "settings.h"

void setupBluetooth()
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
