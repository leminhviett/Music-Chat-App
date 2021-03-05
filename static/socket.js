let socket;
let myName = window.appConfig.username;
console.log(myName);

$(document).ready(function(){
    socket = io.connect('http://' + document.domain + ':' + location.port + '/chat');

    // emit join event when connected
    socket.on('connect', function() {
        socket.emit('join', {});
    });

    // listen to status event, then update chat
    socket.on('status', function(message) {
        var chatArea = document.getElementById("chat");

        var newElement = document.createElement("p");
        newElement.className = "container"
        newElement.innerHTML = `
            <b>${message['username']}</b> - ${message['content']}
        `
        chatArea.appendChild(newElement);
    });

    // listen to message from others
    socket.on('message', function(message) {
        var chatArea = document.getElementById("chat");

        var newElement = document.createElement("div");
        newElement.className = "container"
        newElement.style.color = "white";
        if (myName == message['username']) {
            newElement.style.backgroundColor = "#00a0a3"
        } else {
            newElement.style.backgroundColor = "#636363"
        }

        newElement.innerHTML = `
            <p style="margin-bottom:0.25rem"><b>${message['username']}</b> - ${message['time']}</p>
            ${message['content']}
        `

        console.log(newElement)
        chatArea.appendChild(newElement);
    });

    // send msg func
    $('#send').click(function(e) {
            text = $('#text').val();
            $('#text').val('');
            socket.emit('message', { "content" : text});
    });

    // stream music to others
    socket.on('play_music', function(info) {
        var id = info['id']
        console.log("get the music", id);
        play_music(id);
    })
});

function leave_room() {
    socket.emit('leave', "", function() {
        socket.disconnect();
        // go to leave function to clear session
         window.location.href = "/leave";
    });
}

