const http = require("http");
const events = require("./events.js");
const env = require('dotenv').config();

const PORT = (process.env.PORT)?process.env.PORT:null;
if (PORT === null) {
    console.log("\nNot set port or not found .env file");
    process.exit();
}

let message = "Hello World!";
http.createServer(function(request,response){
    console.log(message);
    response.end(message);
}).listen(PORT, "127.0.0.1",()=>{
    console.log("Сервер начал прослушивание запросов на пору "+ PORT);
});

