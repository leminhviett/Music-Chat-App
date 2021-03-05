SC.initialize({
    client_id:  window.appConfig.client_id
});

function play_music(id) {
    SC.stream(`/tracks/${id}`)
        .then(function(player){
            player.play().then(function(){
                console.log('Playback started!');
            }).catch(function(e){
                console.error('Playback rejected. Try calling play() from a user interaction.', e);
            });
        });
}

function request_play_music(track_name, id) {
    socket.emit('play_music', {"track_name" : track_name, "id" : id})
}


function searchMusic() {
    let runningElement = null;
    var name = document.getElementById('info').value;
    console.log(name);

    SC.get('/tracks', {
        q: name
    }).then(function(tracks) {
            console.log("get back res");
            console.log(tracks);

            var res_div = document.getElementById("return-result");
            res_div.innerHTML = ""

            for (let i = 0; i < tracks.length; i ++) {
                let newElement = document.createElement('div');
                var image_ele;
                newElement.className = "card";

                console.log(tracks[i].id)
                if( tracks[i].artwork_url != null) {
                    image_ele = `<img src= ${tracks[i].artwork_url} alt="result" max-width="10%">`
                } else {
                    image_ele = ''
                }


                newElement.innerHTML = ` ${image_ele} <div> <p>Name: ${tracks[i].title}</p> <p>Artist: ${tracks[i].user.username}</p><div>`;

                newElement.onclick = function() {
                    request_play_music(tracks[i].title ,tracks[i].id);
                    if (runningElement != null) {
                        runningElement.style.backgroundColor = "#e6e6e6";
                    }
                    newElement.style.backgroundColor = "#4cede2";
                    runningElement = newElement
                }

                res_div.appendChild(newElement);
            }
        });
}