#include <Arduino.h>
#include <WebSocketsClient.h>
#include <SocketIOclient.h>
#include "settings.h"

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
        break;
    case sIOtype_ACK:
        break;
    case sIOtype_ERROR:
        break;
    case sIOtype_BINARY_EVENT:
        break;
    case sIOtype_BINARY_ACK:
        break;

    default:
        break;
    }
}

void setupSocketIO()
{
    socketIO.begin(SERVER_IP, 4000, "/socket.io/?EIO=4");
    socketIO.onEvent(socketIOEvent);
}