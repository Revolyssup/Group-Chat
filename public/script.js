const socket=io(`/`)
const msgCont=document.getElementById(`message-container`)
const send=document.getElementById(`send-container`)
const msg=document.getElementById(`message-input`)
const typing=document.getElementById(`typing`)


socket.on(`chat-message`,(name,dataJson)=>{AppendMsg(`${name}-${dataJson}`)})

const name=prompt(`Enter name `);
AppendMsg(`You joined`);
socket.emit(`name`, name);
socket.on(`name`,(name)=>{AppendMsg(`${name} joined`)});

socket.on(`typing`,(name)=>{
    if(typing.classList.contains(`hide`))
    {
        typing.classList.remove(`hide`);
        typing.innerText=`${name} is typing...`;
        setTimeout(()=>{
            typing.classList.add(`hide`);
        },500);
    }
    
});

socket.on(`disconnected`,(name)=>{
    AppendMsg(`${name} disconnected`)
});


msg.addEventListener(`keydown`,()=>{
    socket.emit(`typing`, name);
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

function AppendMsg(data){
    const msgElement=document.createElement(`div`);
    msgElement.innerHTML=data;
    msgCont.append(msgElement)
} 


