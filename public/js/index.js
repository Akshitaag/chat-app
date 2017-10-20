var socket=io();

	socket.on('connect',function(){
		console.log("lol");

		
});
	socket.on('disconnect',function() {
		console.log("disconnected");
	});
	socket.on('newMessage',function(message){
		//console.log("Message is");
		console.log(message);
		var li=jQuery('<li></li>');
		li.text(message.from+":"+message.text);
		jQuery('#messages').append(li);
	});

	// socket.emit('createMessage',{
	// 	from: "aggarwalakshita1@gmail.com",
	// 	text: " nice to see you"
	// },function(data){
	// 	console.log("got it"+data);
	// });

	jQuery("#message-form").on('submit',function(e){
		e.preventDefault();

		socket.emit('createMessage',{
		from: "user",
		text: jQuery('[name=message]').val()
	},function(data){
		console.log("got it"+data);
	});
	});
	