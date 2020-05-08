$(() => {
    console.log('loaded');
    
    var socket = io();
    socket.on(('message'), addMessage);
    getMessages();

    $("#send").click(() => {
        var message = { name:$("#name").val(), message: $("#message").val() };
        postMessage(message);
    });
});

function postMessage(message){
    $.post('http://localhost:3000/messages', message);
}


function addMessage(message){
    $("#messages").append(`<h4> ${message.name}</h4><p>${message.message}</p>`)
}

function getMessages(){
    $.get('http://localhost:3000/messages', (data => {
        data.forEach(element => {
            addMessage(element);
        });
    }));

}