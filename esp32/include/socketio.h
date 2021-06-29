#ifndef SOCKETIO_H_
#define SOCKETIO_H_
#include <WebSocketsClient.h>
#include <SocketIOclient.h>

extern SocketIOclient socketIO;
void socketIOEvent(socketIOmessageType_t type, uint8_t *payload, size_t length);
void setupSocketIO();

#endif