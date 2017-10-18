var socket=io();

	socket.on('connect',function(){
		console.log("lol");

		socket.emit('createMessage',{
		from: "aggarwalakshita1@gmail.com",
		text: " nice to see you"
	});
});
	socket.on('disconnect',function() {
		console.log("disconnected");
	});
	socket.on('newMessage',function(message){
		console.log("Message is");
		console.log(message);
	});
	