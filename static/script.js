var socket;

$(document).ready(function(){
    socket = io.connect('http://' + document.domain + ':' + location.port + '/chat');

    // emit join event when connected
    socket.on('connect', function() {
        socket.emit('join', {});
    });

    // listen to status event, then update chat
    socket.on('status', function(message) {
        $('#chat').val($('#chat').val() + '<' + message + '>\n');
        $('#chat').scrollTop($('#chat')[0].scrollHeight);
    });

    // listen to message from others
    socket.on('message', function(message) {
        $('#chat').val($('#chat').val() + message + '\n');
        $('#chat').scrollTop($('#chat')[0].scrollHeight);
    });

    // send msg func
    $('#send').click(function(e) {
            text = $('#text').val();
            $('#text').val('');
            socket.emit('message', text);
    });
});

function leave_room() {
    socket.emit('leave', "", function() {
        socket.disconnect();
        // go to leave function to clear session
         window.location.href = "/leave";
    });
}