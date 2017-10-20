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
	socket.on('newLocationMessage',function(message){
		var li=jQuery('<li></li>');
		var a=jQuery('<a target="_blank">Location</a>');
		li.text(message.from+":");
		a.attr('href',message.url);
		li.append(a);
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
	
	var locationButton= jQuery("#send-location");
	locationButton.on('click',function(){
		if(!navigator.geolocation){
			return alert("feature not supported");
		}

		navigator.geolocation.getCurrentPosition(function(position){
			socket.emit('createLocationMessage',{
				latitude: position.coords.latitude,
				longitude: position.coords.longitude
			});
		},function(){
			alert('Unable fetch to location');
		});
	});