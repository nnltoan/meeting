function peerCallProcess() {

    navigator.mediaDevices.getUserMedia({
        video: true,
        audio: {
            sampleSize: 8,
            echoCancellation: true
        }
    }).then(stream => {

        addVideoStream(myVideo, stream)

        videoMap.set(myId, myVideo);

        localMediaStream = stream;
        //Answer call
        myPeer.on('call', call => {
            call.answer(stream)
            console.log("answer, send my stream, my socket Id : " + socket.id)
            ++userCounter
            //if (userCounter == 1) hostPC_userId =1;//todo set hostpc id
            console.log("me and " + userCounter + " other user are connected")
            const video = document.createElement('video')
            call.on('stream', userVideoStream => {
                console.log("call, recive first stream, " + "check video,audio: "
                    + checkStream(userVideoStream).hasVideo + "," + checkStream(userVideoStream).hasAudio)
                addVideoStream(video, userVideoStream)
                //map_user.set(userId, video);
                //console.log("--->add video: " + map_user.get(userId));
            })

            call.on('close', () => {
                console.log("remove video***");
                video.remove()
            })
        })

        socket.on('user-connected', userId => {
            //Start call
            const fc = () => connectToNewUser(userId, stream)
            timerid = setTimeout(fc, 1000, userId, stream)
            ++userCounter
            console.log("new user: " + userId)
            console.log("me and " + userCounter + " other user are connected")

            //Start connection, data connect
            const fc2 = () => dataconnect(userId)
            timerid = setTimeout(fc2, 1000, userId)
        })

        sideContent = getId("sideContent");
        const videoWrap = document.createElement("div");
        const myStatusMenu = document.createElement("div");
        const myCountTime = document.createElement("p");
        // menu Status
        myStatusMenu.setAttribute("id", "myStatusMenu");
        myStatusMenu.className = "statusMenu";
        // session time
        myCountTime.setAttribute("id", "countTime");
        // tippy(myCountTime, {
        //   content: "Session Time",
        // });
        // add elements to myStatusMenu div
        myStatusMenu.appendChild(myCountTime);
        // add elements to video wrap div
        videoWrap.appendChild(myStatusMenu);
        sideContent.appendChild(videoWrap)

        getHtmlElementsById();
        // setButtonsTitle();
        setAudioBtn();
        setVideoBtn();
        setReloadBtn();
        setNotifyBtn();
        startCountTime();

        //If WebSocket is already in CLOSING or CLOSED state
        if (!isOpen(socket)) {
            console.log("socket not open --->reload page")
            setTimeout(function () {
                location.reload()
            }, 2000);
        }
    })
}
