const path= require(`path`)
var express = require('express');
var app= express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

const users={};
app.use('/', express.static(path.join(__dirname, 'public')))
io.on(`connection`, cbOnconnect)

function cbOnconnect(socket){
 
    
    console.log(`new user`);
    socket.on(`chat-msg`,msg=>{
        const name= users[socket.id]
        socket.broadcast.emit(`chat-message`,name, msg)
        console.log(`recieved`)
    })  
    socket.on(`name`, (name)=>{
        users[socket.id]=name;
        socket.broadcast.emit(`name`,name);
    })
    socket.on(`disconnect`,()=>{
        socket.broadcast.emit(`disconnected`, users[socket.id]);
        delete users[socket.id]
    })

    socket.on(`typing`,(name)=>{
        socket.broadcast.emit(`typing`, name);
       
    })
}  

server.listen(+process.env.PORT||3000, ()=>{
    console.log(`listened`+ process.env.PORT);
});


