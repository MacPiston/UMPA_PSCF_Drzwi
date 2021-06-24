#ifndef SETUP_H_
#define SETUP_H_

#include <WiFiMulti.h>
#include <WebSocketsClient.h>
#include <SocketIOclient.h>

extern WiFiMulti wifiMulti;
extern SocketIOclient socketIO;

void setupIO();

void setupWifi();

void setupSocketIO();

void setupBtBeacon();

#endif