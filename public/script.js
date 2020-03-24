const socket=io(`/`)
const msgCont=document.getElementById(`message-container`)
const send=document.getElementById(`send-container`)
const msg=document.getElementById(`message-input`)
const typing=document.getElementById(`typing`)


/*
*Listens for incoming message from other connected clients 
*and passes received name and message as argument to AppendMsg function,
*in order to add the message on DOM along with sender's name
*/
socket.on(`chat-message`,(name,dataJson)=>{AppendMsg(`${name}-${dataJson}`)})

//Asks for client's name to send to server
const name=prompt(`Enter name `);
AppendMsg(`You joined`);


//sends the name of the client to server
socket.emit(`name`, name);

/*
*Server broadcasts name of joined client to all other clients
*which is received here and received name is passed as argument to AppendMsg function
*which in turn updates it on the DOM
*/
socket.on(`name`,(name)=>{AppendMsg(`${name} joined`)});

/*
*Listens for typing event which is sent by server to all other clients when a client starts typing
*/
socket.on(`typing`,(name)=>{
    if(typing.classList.contains(`hide`))
    {
        typing.classList.remove(`hide`);
        typing.innerText=`${name} is typing...`;
        setTimeout(()=>{
            
                 typing.classList.add(`hide`);
            }
        ,1000);
    }
    
});

socket.on(`disconnected`,(name)=>{
    AppendMsg(`${name} disconnected`)
});

//typing event is emmitted
msg.addEventListener(`keydown`,(e)=>{
    /*responds to only alphanumeric keys*/
    if((e.keyCode>=48 && e.keyCode<=111) || (e.keyCode>=186 && e.keyCode<=222)){
        socket.emit(`typing`, name);
    }
} )

send.addEventListener(`submit`,event=>{
    event.preventDefault();
    const msgValue=msg.value.trim();
    if(msgValue==``){
        alert(`Empty String.Enter some text`)
    }else{
        msg.value=``;
        AppendMsg(`You-${msgValue}`)
        socket.emit(`chat-msg`,msgValue);
    }
   
})
/*
*Adds a new div on the DOM and writes the data on it.
*The data is passed as argument to the function
*/
function AppendMsg(data){
    const msgElement=document.createElement(`div`);
    const time= new Date();
    msgElement.setAttribute(`data-time`,time.toLocaleTimeString());
    msgElement.innerHTML=data;
    msgCont.append(msgElement);

} 


