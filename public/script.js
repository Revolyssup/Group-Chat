const socket=io(`/`)
const msgCont=document.getElementById(`message-container`)
const send=document.getElementById(`send-container`)
const msg=document.getElementById(`message-input`)

socket.on(`chat-message`,(name,dataJson)=>{AppendMsg(`${name}-${dataJson}`)})

const name=prompt(`Enter name `);
AppendMsg(`You joined`);
socket.emit(`name`, name);
socket.on(`name`,(name)=>{AppendMsg(`${name} joined`)});

socket.on(`disconnected`,(name)=>{
    AppendMsg(`${name} disconnected`)
})

send.addEventListener(`submit`,event=>{
    event.preventDefault();
    const msgValue=msg.value;
    socket.emit(`new-msg`, msgValue);
    msg.value=``;
    AppendMsg(`You-${msgValue}`)
   
})

function AppendMsg(data){
    const msgElement=document.createElement(`div`);
    msgElement.innerHTML=data;
    msgCont.append(msgElement)
} 