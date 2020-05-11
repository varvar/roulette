const express = require("express");
const bodyParser = require("body-parser");
const socket = require('socket.io');
const jwt = require('jsonwebtoken');
const socketioJwt = require('socketio-jwt');
const helpers = require('./app/helpers/functions');

const app = express();

// parse requests of content-type - application/json
app.use(bodyParser.json());
app.set('trust proxy', true);

const db = require("./app/models");

db.sequelize.sync();

// simple route
app.get("/", (req, res) => {
    res.json({message: "Server is up and running."});
});

require("./app/routes/user.routes.js")(app);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
let server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});

let io = socket(server);

io.set('authorization', socketioJwt.authorize({
  secret: 'varvar',
  handshake: true
}));

let onlineUsers = {};

io.on('connection', function (socket) {
	//Add new connected user to users object
	let decoded = jwt.verify(socket.handshake.query.token, 'varvar');
	io.emit('message', `${decoded.name} connected`);
	io.to(socket.id).emit('message', `Welcome ${decoded.name}! Your last visit was on ${decoded.lastLogin} from IP: ${decoded.ip}`);
	onlineUsers[socket.id] = decoded.id;
	

	socket.on('disconnect', () => {
	    delete onlineUsers[socket.id];
	});

	// emit message to all clients except sender
	socket.on('blast', (data) => {
	    socket.broadcast.emit('message', data);
	});

	// emit a message to a random user
	socket.on('spin', (data) => {
	    let randomClient = helpers.randomProperty(onlineUsers,socket.id,1);
	    if(randomClient[0]){
	    	socket.broadcast.to(randomClient[0]).emit('message', data);
	    }
	});

	// emit a message to X random users. X will be determined by the client.
	socket.on('wild', (data) => {
		let usersCount = 5;
		if(data.usersNumber && !isNaN(data.usersNumber))
			usersCount = Number(data.usersNumber);
		
		let randomClients = helpers.randomProperty(onlineUsers,socket.id,usersCount);
		if(randomClients.length > 0){
			randomClients.forEach(element => {
				socket.broadcast.to(element).emit('message', data.message || '');
			});
		}
	});
});

module.exports = server;
