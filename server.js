const express = require("express");
const bodyParser = require("body-parser");
const socket = require('socket.io');
const jwt = require('jsonwebtoken');
const socketioJwt = require('socketio-jwt');

const app = express();

// parse requests of content-type - application/json
app.use(bodyParser.json());

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

let onlineUsers = [];

io.on('connection', function (socket) {
	let decoded = jwt.verify(socket.handshake.query.token, 'varvar');
	onlineUsers.push({
		socketId:socket.id,
		userId:decoded.id
	});

	socket.on('disconnect', () => {
	    delete onlineUsers[socket.id]; 
	});

	// emit a message to all users
	socket.on('blast', (data) => {
	    console.log(onlineUsers);
	    io.emit('message', data);
	});

	// emit a message to a random user
	socket.on('spin', (data) => {
	    let randomElement = onlineUsers[Math.floor(Math.random() * onlineUsers.length)];
	    //socket.broadcast.to(randomElement.socketId).emit('message', data);
	    io.to(randomElement.socketId).emit('message', data);
	});

	// emit a message to X random users. X will be determined by the client.
	socket.on('wild', (data) => {
	    //socket.broadcast.to(socketid).emit('message', 'for your eyes only');
	});
});

module.exports = server;
