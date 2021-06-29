#include <Arduino.h>
#include <WebSocketsClient.h>
#include <SocketIOclient.h>
#include <ArduinoJson.h>
#include "settings.h"
#include "io.h"

SocketIOclient socketIO;

void socketIOEvent(socketIOmessageType_t type, uint8_t *payload, size_t length)
{
    switch (type)
    {
    case sIOtype_CONNECT:
        socketIO.send(sIOtype_CONNECT, "/");
        Serial.println("[SIO] Connected");
        break;
    case sIOtype_DISCONNECT:
        Serial.println("[SIO] Disconnected");
        break;
    case sIOtype_EVENT:
    {
        char *sptr = NULL;
        int id = strtol((char *)payload, &sptr, 10);
        Serial.printf("[SIO] Got event: %s id: %d\n", payload, id);

        DynamicJsonDocument eventData(1024);
        DeserializationError error = deserializeJson(eventData, payload, length);
        if (error)
        {
            Serial.print(F("deserializeJson() failed: "));
            Serial.println(error.c_str());
            return;
        }

        const char *eventName = eventData[0].as<char *>();
        const char *uuid = eventData[1]["uuid"].as<char *>();

        Serial.printf("[SIO] Event name: %s \n", eventName);
        Serial.printf("[SIO] Lock uuid: %s \n", uuid);

        if (strcmp(uuid, LOCK_UUID) == 0)
        {
            if (strcmp(eventName, "openDoor") == 0)
            {
                Serial.println("Lock opening");
                openLock();
            }
            else if (strcmp(eventName, "quickOpenDoor") == 0)
            {
                Serial.println("Lock quick-opening");
                //TODO
            }
            else if (strcmp(eventName, "closeDoor") == 0)
            {
                Serial.println("Lock closing");
                closeLock();
            }
        }
    }
    break;
        // case sIOtype_ACK:
        //     break;
        // case sIOtype_ERROR:
        //     break;
        // case sIOtype_BINARY_EVENT:
        //     break;
        // case sIOtype_BINARY_ACK:
        //     break;

    default:
        break;
    }
}

void setupSocketIO()
{
    socketIO.begin(SERVER_IP, 4000, "/socket.io/?EIO=4");
    socketIO.onEvent(socketIOEvent);
}