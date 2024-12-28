import express from "express";  
import mqtt from "mqtt";
import cors from 'cors';
const app = express();
const options={
    host: 'a0a712adcf8c47f9b88f1eeaced34718.s1.eu.hivemq.cloud',
    port: 8883,
    protocol: 'mqtts',
    username: 'dhiraj2',
    password: 'RR@j12345'
}
const mqttClient = mqtt.connect("mqtt://a0a712adcf8c47f9b88f1eeaced34718.s1.eu.hivemq.cloud",{
    username:"dhiraj2",
    password:"RR@j123456",
    port:8883,
    protocol:"mqtts",
    
});
// mqttClient.on("connect",(packet) => {
//     console.log(packet);
    
//     // console.log(packet);
// })
// mqttClient.on("error",(err) => {
//     console.log(err);
    
//     // console.log(packet);
// })
// HTTP endpoint to control relays
const corsOptions = {
  origin: 'http://localhost:5173', // allow requests from this origin
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS', // allow these methods
  preflightContinue: false, // disable preflight requests
  optionsSuccessStatus: 200, // return 200 OK for OPTIONS requests
};

app.use(cors(corsOptions));
app.get("/api/relay/:id/:action",async (req, res) => {
  const relayId = req.params.id;
  const action = req.params.action.toUpperCase();

  if (["ON", "OFF"].includes(action)) {
    const topic = `/smartboard/relay/${relayId}`;
    const result = await mqttClient.publish(topic, action);
    
    // console.log(result);
    
    res.send(`Relay ${relayId} turned ${action}`);
  } else {
    res.status(400).send("Invalid action");
  }
});

// Start server
app.listen(3000, () => {
  console.log("HTTP server running on port 3000");
});
