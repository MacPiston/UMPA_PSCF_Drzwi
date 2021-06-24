#ifndef SOCKETIOHANDLER_H_
#define SOCKETIOHANDLER_H_

#include <WebSocketsClient.h>
#include <SocketIOclient.h>

#include "setup/setup.h"

void socketIOEvent(socketIOmessageType_t type, uint8_t *payload, size_t length)
{
    switch (type)
    {
    case sIOtype_CONNECT:
        Serial.printf("[SIO] connectedto: %s\n", payload);
        socketIO.send(sIOtype_CONNECT, "/");
        break;

    case sIOtype_DISCONNECT:
        Serial.println("[SIO] disconnected");
        break;

    default:
        break;
    }
}
#endif