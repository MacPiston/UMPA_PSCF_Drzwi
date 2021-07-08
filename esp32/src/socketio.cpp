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
        digitalWrite(STATUS_LED, HIGH);

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
            DynamicJsonDocument responseData(256);
            char responseString[128];
            if (strcmp(eventName, "openLock") == 0)
            {
                Serial.println("Lock opening");
                openLock();
                responseData[0] = "openLockResponse";
                responseData[1]["didOpen"] = true;
                responseData[1]["uuid"] = LOCK_UUID;
                serializeJson(responseData, responseString);

                if (socketIO.sendEVENT(responseString))
                    Serial.printf("[SIO] Response sent: %s \n", responseString);
            }
            else if (strcmp(eventName, "quickOpenLock") == 0)
            {
                Serial.println("Lock quick-opening");

                openLockTime();

                responseData[0] = "quickOpenLockResponse";
                responseData[1]["didOpen"] = true;
                responseData[1]["uuid"] = LOCK_UUID;
                serializeJson(responseData, responseString);

                if (socketIO.sendEVENT(responseString))
                    Serial.printf("[SIO] Response sent: %s \n", responseString);
            }
            else if (strcmp(eventName, "closeLock") == 0)
            {
                Serial.println("Lock closing");
                closeLock();
                responseData[0] = "closeLockResponse";
                responseData[1]["didClose"] = true;
                responseData[1]["uuid"] = LOCK_UUID;
                serializeJson(responseData, responseString);

                if (socketIO.sendEVENT(responseString))
                    Serial.printf("[SIO] Response sent: %s \n", responseString);
            }
        }
        digitalWrite(STATUS_LED, LOW);
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