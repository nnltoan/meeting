function connectToNewUser(userId, stream) {
    //Start call
    const call = myPeer.call(userId, stream)
    console.log("call, send my stream")
    const video = document.createElement('video')
    hostVideo = video;
    console.log("call, userId,video : " + userId +","+ video)
    //videoMap.set(userId, hostVideo);
    video.addEventListener('ended', handle_videoEnd, false);
    stream.addEventListener('ended', handle_streamEnd, false);

    
    try {
        call.on('stream', userVideoStream => {
            console.log("call, recive new stream, "
         /*+ "check video,audio:  " + checkStream(userVideoStream).hasVideo+","+checkStream(userVideoStream).hasAudio */)
            addVideoStream(video, userVideoStream)
            map_user.set(userId, video);
            console.log("--->add video: " + map_user.get(userId));
            document.getElementById(
                'hostId',
            ).innerText = ``;;//`CONNECTED TO ${call.peer}.`;
        })
    }
    catch (err) {
        console.log("Peer ERROR: " + err)
        if (call = null) location.reload();
    }



    call.on('error', (error) => {
        console.log("call error: " + error);
        console.log("need close video??");
    })

    call.on('close', () => {
        console.log("remove video");
        video.remove()
    })

    peers[userId] = call
    console.log("peers[" + userId + "]:" + peers[userId]);
}
function handle_videoEnd(e) {
    console.log("handle_videoEnd");
    //remove video here
    //add menu here
    hostVideo.remove();
}
function handle_streamEnd(e) {
    console.log("handle_streamEnd");
    //remove video here
    //add menu here
    hostVideo.remove();
}