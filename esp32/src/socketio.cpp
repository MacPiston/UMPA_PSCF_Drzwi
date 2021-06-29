#include <WebSocketsClient.h>
#include <SocketIOclient.h>

SocketIOclient socketIO;

void setupSocketIO()
{
    socketIO.begin(SERVER_IP, 4000, "/socket.io/?EIO=4");
    socketIO.onEvent(socketIOEvent);
}