const path= require(`path`)
var express = require('express');
var app= express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

//maintain an object with socket id as keys and names as values
const users={};

//serve static files when request is sent to server 
app.use('/', express.static(path.join(__dirname, 'public')))

//opening socket connection on server side listening to client's websocket request
io.on(`connection`, cbOnconnect)

/*
*function is executed when a socket connection is established 
*and that socket is passed as argument
*/
function cbOnconnect(socket){
 
    
    console.log(`new user`);

    /*
    *listens for chat-msg event 
    *and emits it back to other clients with name and message of client sending the message 
    */
    socket.on(`chat-msg`,msg=>{
        const name= users[socket.id]
        socket.broadcast.emit(`chat-message`,name, msg)
        console.log(`recieved`)
    })  

    /*
    *listens for name event (when a client enters the name) 
    *and emits it back to other clients with name of client sending the message */
    socket.on(`name`, (name)=>{
        users[socket.id]=name;
        socket.broadcast.emit(`name`,name);
    })

    //listens for disconnect event when a socket/client is disconnected 
    socket.on(`disconnect`,()=>{
        socket.broadcast.emit(`disconnected`, users[socket.id]);
        delete users[socket.id]
    })

    //listens for typing event and emit it back to other clients with name of client who is typing 
    socket.on(`typing`,(name)=>{
        socket.broadcast.emit(`typing`, name);
       
    })
}  

/*
*setting up server listening at port 3000 or at some other port set by environmental variable
*/
server.listen(+process.env.PORT||3000, ()=>{
    
        console.log(`listened`+ (process.env.PORT||3000) );
    
});


