((root) => {
    Number.prototype.pad = function (size) {
        var s = String(this);
        while (s.length < (size || 2)) {
            s = '0' + s;
        }
        return s;
    };

    root.randomDigits = (length) => {
        return Math.floor(100000 + Math.random() * 900000).pad(6);
    };
})(this);

function isOpen(socket) { return socket.readyState === socket.OPEN }

function checkStream(stream) {

    var hasMedia = { hasVideo: false, hasAudio: false };

    if (stream.getAudioTracks().length)// checking audio presence
        hasMedia.hasAudio = true;

    if (stream.getVideoTracks().length)// checking video presence
        hasMedia.hasVideo = true;

    return hasMedia;
}

function addVideoStream(video, stream) {
    video.srcObject = stream
    video.addEventListener('loadedmetadata', () => {
        video.play()
        console.log("play video")
    })
    videoGrid.append(video)
}

function getHtmlElementsById() {
    countTime = getId("countTime");
    // myVideo = getId("myVideo");
    // left buttons
    audioBtn = getId("audioBtn");
    videoBtn = getId("videoBtn");
    reloadBtn = getId("reloadBtn");
    notifyBtn = getId("notifyBtn");
    fullScreenBtn = getId("fullScreenBtn");
    leaveRoomBtn = getId("leaveRoomBtn");
}



/**
 * Get Html element by Id
 * @param {*} id
 */
function getId(id) {
    return document.getElementById(id);
}

/**
 * Return time to string
 * @param {*} time
 */
function getTimeToString(time) {
    let diffInHrs = time / 3600000;
    let hh = Math.floor(diffInHrs);
    let diffInMin = (diffInHrs - hh) * 60;
    let mm = Math.floor(diffInMin);
    let diffInSec = (diffInMin - mm) * 60;
    let ss = Math.floor(diffInSec);
    let formattedHH = hh.toString().padStart(2, "0");
    let formattedMM = mm.toString().padStart(2, "0");
    let formattedSS = ss.toString().padStart(2, "0");
    return `${formattedHH}:${formattedMM}:${formattedSS}`;
}
/**
 * Audio mute - unmute button click event
 */
function setAudioBtn() {
    audioBtn.addEventListener("click", (e) => {
        handleAudio(e, false);
    });
}

/**
 * Video hide - show button click event
 */
function setVideoBtn() {
    videoBtn.addEventListener("click", (e) => {
        handleVideo(e, false);
    });
}

/**
 * reload page - show button click event
 */
function setReloadBtn() {
    reloadBtn.addEventListener("click", (e) => {
        handleReload(e, false);
    });
}

/**
 * send notificaion - show button click event
 */
function setNotifyBtn() {
    notifyBtn.addEventListener("click", (e) => {
        handleNotify(e, false);
    });
}


/**
 * Handle Audio ON-OFF
 * @param {*} e event
 * @param {*} init bool true/false
 */
function handleAudio(e, init) {
    // https://developer.mozilla.org/en-US/docs/Web/API/MediaStream/getAudioTracks
    localMediaStream.getAudioTracks()[0].enabled = !localMediaStream.getAudioTracks()[0]
        .enabled;
    myAudioStatus = localMediaStream.getAudioTracks()[0].enabled;
    // e.target.className = "fas fa-microphone" + (myAudioStatus ? "" : "-slash");
    if (init) {
        // audioBtn.className = "fas fa-microphone" + (myAudioStatus ? "" : "-slash");
    }
    if (myAudioStatus) {
        document.querySelector('#audioBtn').style.backgroundColor = "#f5f5f5";
    } else {
        document.querySelector('#audioBtn').style.backgroundColor = "#f42121";
    }
    // setMyAudioStatus(myAudioStatus);
}

/**
 * Handle Video ON-OFF
 * @param {*} e event
 * @param {*} init bool true/false
 */
function handleVideo(e, init) {
    // https://developer.mozilla.org/en-US/docs/Web/API/MediaStream/getVideoTracks
    localMediaStream.getVideoTracks()[0].enabled = !localMediaStream.getVideoTracks()[0]
        .enabled;
    myVideoStatus = localMediaStream.getVideoTracks()[0].enabled;
    // e.target.className = "fas fa-video" + (myVideoStatus ? "" : "-slash");
    if (init) {
        // videoBtn.className = "fas fa-video" + (myVideoStatus ? "" : "-slash");
    }
    if (myVideoStatus) {
        document.querySelector('#videoBtn').style.backgroundColor = "#f5f5f5";
    } else {
        document.querySelector('#videoBtn').style.backgroundColor = "#f42121";
    }
    // setMyVideoStatus(myVideoStatus);
}

/**
 * Handle Reload Page
 * @param {*} e event
 * @param {*} init bool true/false
 */
function handleReload(e, init) {
    socket.emit('send-reload', ROOM_ID, myId)
    console.log("Send Page reload request")
    to_reload = false;
}

/**
 * Handle notification
 * @param {*} e event
 * @param {*} init bool true/false
 */
function handleNotify(e, init) {
    socket.emit('send-notify', ROOM_ID, myId)
    console.log("Send notify request")
}
// /**
//  * Using tippy aka very nice tooltip!
//  * https://atomiks.github.io/tippyjs/
//  */
//  function setButtonsTitle() {
//   tippy(audioBtn, {   content: "To ON OFF audio",});
//   tippy(videoBtn, {   content: "To ON OFF video",});
//   tippy(reloadBtn, {   content: "To send a F5 (page reload) to all User",});
//   tippy(notifyBtn, {   content: "To send a notification (Ringtone) to all User",});
// }

/**
 * Start talk time
 */
function startCountTime() {
    // countTime.style.display = "inline";
    callStartTime = Date.now();
    setInterval(function printTime() {
        callElapsedTime = Date.now() - callStartTime;
        countTime.innerHTML = getTimeToString(callElapsedTime);
    }, 1000);
}

function pause_alert() {
    audio_alert.pause();
    audio_alert.currentTime = 0;
}