

#include <WiFi.h>
#include <WiFiClientSecure.h>
#include <PubSubClient.h>
// install pupsubclient from arduino library manager


// WiFi credentials
const char* ssid = "JIET@JOD";
const char* password = "2912868152";

// MQTT broker settings
const char* mqtt_server = "a0a712adcf8c47f9b88f1eeaced34718.s1.eu.hivemq.cloud"; // Replace with your broker IP
const int mqtt_port = 8883;
const char* mqtt_user = "dhiraj2"; // Optional
const char* mqtt_password = "RR@j123456"; // Optional
#define LED_BUILTIN 2 
// WiFiClientSecure espClient;  // Use WiFiClientSecure instead of WiFiClient


// PubSubClient client(espClient);
WiFiClientSecure wifiClient;
PubSubClient client(wifiClient);

// Relay pins
int relayPins[] = {23, 22, 21, 19};

// Function to handle incoming MQTT messages
void callback(char* topic, byte* payload, unsigned int length) {
  String message;
  for (unsigned int i = 0; i < length; i++) {
    message += (char)payload[i];
  }
  Serial.printf("Message arrived: %s %s",topic, message.c_str() );

  // Parse topic to determine relay
  if (String(topic).startsWith("/smartboard/relay/")) {
    int relayNumber = String(topic).substring(18).toInt();
    if (relayNumber >= 1 && relayNumber <= 4) {
      if (message.compareTo("ON")) {
        digitalWrite(relayPins[relayNumber - 1], HIGH);
      } else if(message.compareTo("OFF"))  {
        digitalWrite(relayPins[relayNumber - 1], LOW);
      }
    }
  }
}

// Reconnect to MQTT broker
void reconnect() {
  while (!client.connected()) {
    Serial.print("Connecting to MQTT...");
    if (client.connect("ESP32Client-",mqtt_user,mqtt_password)) {
      Serial.println("connected");
      // Subscribe to relay control topics
      for (int i = 1; i <= 4; i++) {
        String topic = "/smartboard/relay/" + String(i);
        client.subscribe(topic.c_str());
      }
    } else {
      Serial.print("failed, rc=");
      Serial.println(client.state());
      delay(5000);
    }
  }
}

void setup() {
  pinMode(LED_BUILTIN, OUTPUT);

  Serial.begin(115200);
  delay(200);
  for (int i = 0; i < 4; i++) {
    pinMode(relayPins[i], OUTPUT);
    digitalWrite(relayPins[i], LOW);
  }
  // Initialize WiFi
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWiFi connected!");
  digitalWrite(LED_BUILTIN, HIGH);  
  // Initialize MQTT
  wifiClient.setInsecure();
  client.setServer(mqtt_server, mqtt_port);
  client.setCallback(callback);

  // Initialize relays
}

void loop() {
  // Maintain MQTT connection
  if (!client.connected()) {
    reconnect();
  }
  client.loop();
}
