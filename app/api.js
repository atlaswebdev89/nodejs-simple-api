const http = require("http");
const env = require('dotenv').config();
const { randomUUID } = require('crypto');
const {uuid_valid, validate_post_data }  = require('./validates.js');

const PORT = process.env.PORT || null;
if (PORT === null) {
    console.log("\nNot set port or not found .env file");
    process.exit();
}

// array data in-memory
const users = [];

// Api server
http.createServer(function(request,response){
    process.stdout.write("\nMethod: "+ request.method + "\nRequest URL: " + request.url + "\n");
    response.setHeader("Content-Type", "application/json");
        try {
                // router 
                switch(true){
                    //get all users (get or head request)
                    case (request.url === '/api/users' && (request.method === "GET" || request.method === "HEAD")):
                        get_api_users(request,response);
                        break;
                    // create new user (post request)
                    case (request.url === '/api/users' && request.method === "POST"):
                        create_users(request,response);
                        break;
                    // get user from uuid
                    case ( (request.url.match("/api/users/[a-zA-Z0-9\-]+$")?true:null) && (request.method === "GET" || request.method === "HEAD")):
                        get_user (request,response);
                        break;
                    // edit user data
                    case ( (request.url.match("/api/users/[a-zA-Z0-9\-]+$")?true:null) && request.method === "PUT"):
                        get_user (request,response);
                        break;
                    // delete user
                    case ( (request.url.match("/api/users/[a-zA-Z0-9\-]+$")?true:null) && request.method === "DELETE"):
                        delete_user (request, response);
                        break;
                    // not found url api
                    default:
                        endpoints_not_found(response);
                }
        }catch(err) {
            response.writeHead(JSON.parse(err.message).statusCode);
            response.write(err.message);
            response.end("\n");
        }
}).listen(PORT, "127.0.0.1",()=>{
    console.log("Start http server!");
    console.log("Сервер начал прослушивание запросов на порту " + PORT);
});

// handler not found endpoint api
const endpoints_not_found = (response) => {
    process.stdout.write("Status: 404\nResponse: endpoints not found\n");
        const message = {
            statusCode: 404,
            message: "Uri api http not found"
        }
    throw new Error (JSON.stringify(message));
}

// get all users (get request)
const get_api_users = (request,response) => {
    process.stdout.write("Status: 200\nResponse: request success\n")
    response.statusCode=200;
    response.write(JSON.stringify(users) + "\n");
    response.end();
}
// create new user (post request)
const create_users = (request,response) => {
    let body="";
    request.on('data', (chunk) => {
        body += (chunk.toString());
    })

    request.on("end", () => {
        try {
            const prop = validate_post_data(body);
            // Бросам исключение если полученные json данные не полностью заполнены
            if( prop.statusCode ) throw new Error(JSON.stringify(prop));
            prop.uuid = randomUUID(); 
            users.push(prop);  
            process.stdout.write("Status: 201\nResponse: create user success\n")
                response.writeHead(201);
                response.write(JSON.stringify(prop));
                response.end("\n");
        }catch (err) {
            response.writeHead(JSON.parse(err.message).statusCode);
            response.write(err.message);
            response.end();
        }
    })
}

//get user 
const get_user = (request, response) => {
    const uuid = request.url.split('/').slice(-1).join();
    const valid = uuid_valid (uuid);
    if (valid) {
        const result = users.find (item => item.uuid === uuid);
        if (result) {
            process.stdout.write("Status: 200\nResponse: get user success\n");
            response.writeHead(200);
            response.write(JSON.stringify(result));
            response.end("\n");
        }else {
            process.stdout.write("Status: 404\nResponse: not found user\n")
            const error = {
                statusCode: 404, 
                message: "Not found users is get UUID"
            }
           throw new Error (JSON.stringify(error));
        }

    }else {
        process.stdout.write("Status: 400\nResponse: in valid uuid\n")
            const error = {
                statusCode: 400, 
                message: "Get parametr uuid not valid"
            }
        throw new Error(JSON.stringify(error));
    }
}

//delete user
const delete_user = (request, response) => {
    const uuid = request.url.split('/').slice(-1).join();
    const valid = uuid_valid (uuid);
    
    if (valid) {
        // Search item for uuid
        const indexItem = users.findIndex(item => item.uuid === uuid);
        if (indexItem != -1) {
            // delete user
            const deteleUser = users.splice(indexItem, 1);
            if (delete_user.length > 0) {
                process.stdout.write("Status: 204\nResponse: delete user success\n");
                response.writeHead(204);
                response.end();
            }
        }else {
            process.stdout.write("Status: 404\nResponse: not found user\n")
            const error = {
                statusCode: 404, 
                message: "Not found users is get UUID"
            }
           throw new Error (JSON.stringify(error));
        }

    }else {
        process.stdout.write("Status: 400\nResponse: in valid uuid\n")
            const error = {
                statusCode: 400, 
                message: "Get parametr uuid not valid"
            }
        throw new Error(JSON.stringify(error));
    }


}