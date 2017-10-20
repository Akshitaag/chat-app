var socket=io();
	function scrollToBottom () {
  // Selectors
  var messages = jQuery('#messages');
  var newMessage = messages.children('li:last-child')
  // Heights
  var clientHeight = messages.prop('clientHeight');
  var scrollTop = messages.prop('scrollTop');
  var scrollHeight = messages.prop('scrollHeight');
  var newMessageHeight = newMessage.innerHeight();
  var lastMessageHeight = newMessage.prev().innerHeight();

  if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
    messages.scrollTop(scrollHeight);
  }
}

	socket.on('connect',function(){
		var params=jQuery.deparam(window.location.search);

		socket.emit('join',params,function(err){
				if(err)
				{
					alert(err);
					window.location.href='/';
				}
				else
				{
					console.log("no err");
				}
		});
		
});
	socket.on('disconnect',function() {
		console.log("disconnected");
	});
	socket.on('newMessage',function(message){
		//console.log("Message is");
		var formatdate=moment(message.createdAt).format('h:mm a');
		console.log(message);
		var li=jQuery('<li class="message"></li>');
		li.html("<div class='message__title'> <h4>"+message.from+"</h4> <span>"+formatdate+" </span> </div>"+" <div class='message__body'> <p> "+ message.text +" </p> </div>");
		jQuery('#messages').append(li);
		scrollToBottom () ;
	});
	socket.on('newLocationMessage',function(message){
		var formatdate=moment(message.createdAt).format('h:mm a');
		var li=jQuery('<li class="message"></li>');
		var a=jQuery('<a target="_blank">My current Location</a>');
		li.html("<div class='message__title'> <h4>"+message.from+"</h4> <span>"+formatdate+" </span> </div>");
		a.attr('href',message.url);
		//a.html(" <div class='message__body'> <p> "+ Location +" </p> </div>")
		li.append(a);
		jQuery('#messages').append(li);
		scrollToBottom () ;
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
		 jQuery('[name=message]').val('');
	});
	});
	
	var locationButton= jQuery("#send-location");
	locationButton.on('click',function(){
		if(!navigator.geolocation){
			return alert("feature not supported");
		}
			locationButton.attr('disabled','disabled').text('Sending location...');
		navigator.geolocation.getCurrentPosition(function(position){
			locationButton.removeAttr('disabled','disabled').text('Send location');
			socket.emit('createLocationMessage',{
				latitude: position.coords.latitude,
				longitude: position.coords.longitude
			});
		},function(){
			locationButton.removeAttr('disabled','disabled').text('Send location');
			alert('Unable fetch to location');
		});
	});