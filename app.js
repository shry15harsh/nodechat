var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var normal_users = new Array();
var admin_users = new Array();
var atou = {};
var utoa = {};

app.get('/i', function(req, res){
  res.sendfile('index.html');
});

app.get('/a', function (req, res){
res.sendfile('admin.html');
});


io.on('connection', function(socket){
  console.log('a user connected '+socket.id);
socket.on('connectuser', function(userid){
console.log(userid+' to be connected');
atou[socket.id] = userid;
utoa[userid] = socket.id;
console.log(atou[socket.id]+' , '+utoa[userid]);
});
  socket.on('user', function(msg){
    if(msg=='admin'){
 admin_users.push(socket.id);
io.to(socket.id).emit('users',{users:normal_users});
}else{
normal_users.push(socket.id);
for(var i in admin_users){
io.to(admin_users[i]).emit('users',{users:normal_users});
}
}
console.log(msg+' is connected');
});
socket.on('chat message', function(msg){
console.log('chatting...');
if(atou[socket.id]){
console.log(socket.id + ' sending msg to user '+atou[socket.id]);
io.to(socket.id).emit('chat',msg);
io.to(atou[socket.id]).emit('chat',msg);
}else{
console.log(socket.id + ' sending msg to admin '+utoa[socket.id]);
io.to(socket.id).emit('chat',msg);
io.to(utoa[socket.id]).emit('chat',msg);
}
});
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
