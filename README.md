# Music Chat App

Simple web-application allows users to log-in, chat, and listening music toghether.

Music is streamt from [Sound-cloud](https://developers.soundcloud.com/docs/api/guide).

## Set up

1. `docker build -t music-chat-app:0.0.1 .`
2. `docker run -p 5000:5000 -env CLIENT_ID={your soundcloud client id} music-chat-app:0.0.1`
3. Access the app through `localhost:5000`

Final result can be viewed in [images](./images) folder

## Notes

Currently, we cannot register on SoundCloud for new CLIENT_ID. So, we either need to use old pre-registered CLIENT_ID or work around by scraping data directly from Sound-cloud sites.
