const express=require('express');
const path= require('path');
const moment=require('moment');
const socketio=require('socket.io');
const http	= require('http');
const {isRealString}= require('./utils/validation.js');
const {Users}= require('./utils/users.js');
const publicPath= path.join(__dirname,'../public')
var app=express();
console.log("hello");
app.use(express.static(publicPath));	

var server= http.createServer(app);
var io= socketio(server);
var users= new Users();
io.on('connection',(socket)=>{
	console.log("new user");
	// socket.emit('newMessage',{
	// 	from:"aggarwalakshita@gmail.com",
	// 	text:"hey there",
	// 	createAt: 123
	// });
	socket.on('join',(params,callback)=>{
		if(!isRealString(params.name) || !isRealString(params.room))
		{
			return callback('Name or room name not entered properly');
		}	
		socket.join(params.room);
		users.addUser(socket.id,params.name,params.room);
		socket.emit('newMessage',{
		from:"Admin",
		text:"welcome",
		createAt: moment().valueOf()
	});
	socket.broadcast.to(params.room).emit('newMessage',{
		from:"Admin",
		text:`${params.name} has joined`,
		createAt: moment().valueOf()
	});
		callback();
	});
	socket.on('createMessage',(message,callback)=>{
		console.log('createMessage', message);
		io.emit('newMessage',{
			from: message.from,
			text: message.text,
			createdAt: moment().valueOf()
		});
		callback();
	});

	socket.on('createLocationMessage',(coords)=>{
		io.emit('newLocationMessage',{
			from:"Admin",
			url: `https://www.google.com/maps?q=${coords.latitude},${coords.longitude}`,
			createAt: moment().valueOf()
		});
	});
	socket.on('disconnect',() => {
		console.log("disconnected client");
	});
});
server.listen(3000,()=>{
	console.log("server has started");
});