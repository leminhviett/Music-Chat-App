let socket;

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

    // stream music to others
    socket.on('play_music', function(id) {
        console.log("get the music", id);
        broadcastMusic(id);
    })
});

function leave_room() {
    socket.emit('leave', "", function() {
        socket.disconnect();
        // go to leave function to clear session
         window.location.href = "/leave";
    });
}

function broadcastMusic(id) {
    SC.stream(`/tracks/${id}`)
        .then(function(player){
            player.play().then(function(){
                console.log('Playback started!');
            }).catch(function(e){
                console.error('Playback rejected. Try calling play() from a user interaction.', e);
            });
        });
}

function playMusic(id) {
//    SC.stream(`/tracks/${id}`)
//        .then(function(player){
//            player.play().then(function(){
//                console.log('Playback started!');
//            }).catch(function(e){
//                console.error('Playback rejected. Try calling play() from a user interaction.', e);
//            });
//        });

    socket.emit('play_music', id)
}
