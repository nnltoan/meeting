const socket = io('/')
const videoGrid = document.getElementById('video-grid')
//const myPeer = new Peer()
const peerId = "user_" + randomDigits(6); //myID
const myPeer = new Peer(peerId, {
  config: {
    'iceServers': [
      { urls: 'stun:stun.l.google.com:19302' },
      {
        urls:
          [
            "turn:******.tk:3478?transport=udp",
            "turn:******.tk:3478?transport=tcp",
          ],
        credential: '******',
        username: '******'
      }

      // { //https://gist.github.com/yetithefoot/7592580
      //   url: 'turn:numb.viagenie.ca',
      //   credential: 'vqkd@s5nptaJjTB',
      //   username: 'nnl.toan@gmail.com'
      //   },
    ]
  }
})
//const myPeer = new Peer(undefined, { secure: true, host: "lsi-dev-meet.herokuapp.com", port: 3000, });
//const myPeer = new Peer(undefined, {
//  host: '/', // This will force the localhost/IP of the machine
//  path: '/peerjs', // Path that was specified in the server.js file for the peerServer's app.use() method.
//  port: '3000', // This needs to be the same port as specified in the server.js
//});
//const myPeer = new Peer(''+Math.floor(Math.random()*2**18).toString(36).padStart(4,0), {
//    host: "lsi-dev-meet.herokuapp.com",
//    debug: 1,
//    path: '/myapp'
//});
let userCounter = 0
let sideContent;

const peers = {}
const audio_alert = new Audio('https://www.soundjay.com/phone/sounds/telephone-ring-02.mp3');
const map_user = new Map();
const myVideo = document.createElement('video')


myVideo.muted = true

var countTime;
var useAudio = true;
var useVideo = true;
var audioBtn;
var videoBtn;
var reloadBtn;
var notifyBtn;
var leaveRoomBtn;
var myVideoStatus = true;
var myAudioStatus = true;
var localMediaStream; // my microphone / webcam
var myId = "id";
var alarm;
var to_reload = true;
var clientConnections = Immutable.Map({});
var userNameMap = Immutable.Map({});
var videoMap = new Map();
var hostConnection, connection;
var call;
var myName;
var hostVideo;

navigator.mediaDevices.getUserMedia({
  video: true,
  audio: {
    sampleSize: 8,
    echoCancellation: true
  }
}).then(stream => {
  addVideoStream(myVideo, stream)

  videoMap.set(myId, myVideo );

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

  //Receive DATA connection
  myPeer.on('connection', conn => {
    console.log("data connection START")

    conn.on('open', () => {
      console.log(`[connection] Connection to ${conn.peer} established.`,);
      if (!clientConnections.has(conn.peer)) {
        clientConnections = clientConnections.set(
          conn.peer,
          conn,
        );
        // userNameMap = userNameMap.set(
        //   conn.peer,
        //   document.getElementById('hostIdVal').value,
        // );
      }

      const data = {
        sender: 'SYSTEM',
        message: `${conn.peer} joined.`,
      };

      updatePeerList();
      updateMessageBoard(data.sender, data.message);

      // broadcast({
      //     ...data,
      //     peers: generatePeerList(),
      // });
      document.getElementById(
        'hostId',
      ).innerText = ``;//`Last user connected was: ${conn.peer}.`;
    })

    conn.on('data', (data) => {
      console.log('[connection] Recvied data:\n', data)

      updateMessageBoard(data.sender, data.message)
      updatePeerList(data.peers);
      // broadcast({
      //     ...data,
      //     peers: generatePeerList(),
      // })
    })

    conn.send('Hello!');

    conn.on('close', () => {
      console.log(`[Receive] Connection to ${conn.peer} is closed.`);
      clientConnections = clientConnections.delete(conn.peer.toString(), )
      userNameMap = userNameMap.delete(
        conn.peer.toString(),
      );
      console.log(`peer:` + conn.peer);
      // if (peers[conn.peer]) {
      //   console.log(`>>to close video`);
      //   peers[conn.peer].close()  //to close video
      // }
      console.log(`video:` + videoMap.get(conn.peer.toString()));
      console.log(`video-grid:` + document.getElementById('video-grid').value);
      
      // if (videoMap.get(conn.peer)){
      //   console.log(`>>to remove video`);
      //   videoMap.get(conn.peer).remove()
      // } else {
      //   console.log(`>>to remove video2222222`);
      //   videoMap.get(conn.peer).remove()
      // }
      videoMap = videoMap.delete(conn.peer.toString(), )

      const data = {
        sender: 'SYSTEM',
        message: `${conn.peer} left.`,
      }

      updatePeerList();
      updateMessageBoard(data.sender, data.message);

      // broadcast({
      //     ...data,
      //     peers: generatePeerList(),
      // })

      document.getElementById('hostId').innerText =
        'NOT CONNECTED TO ANYONE'
    })
    connection = conn;
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

socket.on('user-disconnected', userId => {
  console.log("peers[" + userId + "]:" + peers[userId]);

  if (peers[userId]) {
    peers[userId].close()
  } else {
    console.log("--->remove video: " + map_user.get(userId));
    // map_user.get(userId).remove();
    for (const [key, value] of map_user) {
      console.log(key + ' = ' + value)
      if (peers[key]) value.remove();
    }
    console.log("--->reload page")
    setTimeout(function () {
      if (userCounter < 1) {
        location.reload()
      }
      console.log("--->reload page cancel")
    }, 15000);
    // videoGrid.remove();
    // peerCallProcess();
    
  }
  --userCounter
  console.log(userId + " : user disconnected")
  console.log("me and " + userCounter + " other user are connected")
})

socket.on('user-reload', all => {
  console.log("--> recives Reload requset!!!")
  if (to_reload === true) {
    //delay 2s before reload page
    console.log("--->reload page")
    setTimeout(function () {
      location.reload()
    }, 2000);
  } else {
    to_reload = true; //the user was send a reload request, will do not reload 
  }
})

socket.on('user-notify', all => {
  console.log("--> recives Notify requset!!!")
  //audio_alert.load();
  var playPromise = audio_alert.play();
  if (playPromise !== undefined) {
    playPromise.then(_ => {
      // Automatic playback started!
      // Show playing UI.
    })
    .catch(error => {
      // Auto-play was prevented
      // Show paused UI.
    });
  }
  confirm("You have a call!") ? pause_alert() : pause_alert();
})



myPeer.on('open', id => {
  socket.emit('join-room', ROOM_ID, id)
  console.log("ROOM_ID:" + ROOM_ID)
  console.log("my ID:" + id)
  myId = id;
  myName = id;
  document.getElementById('selfId').innerText =
    'Your ID: ' + id;

  document.getElementById(
    'status',
  ).innerText = `✔ CONNECTED`;

  document.getElementById("status").style.color = "#0b8500";

  updatePeerList();
})

myPeer.on('disconnected', () => {
  console.log('Disconnected from signaller.');

  document.getElementById(
    'status',
  ).innerText = `✘ DISCONNECTED`;
  document.getElementById("status").style.color = "#d30606";

});

myPeer.on('error', function (err) {
  console.log("Peer ERROR: " + err)
  console.log("-->need reload video");
  setTimeout(function () {
    location.reload()
  }, 2000);
});

socket.on('error', function (err) {
  console.log("Socket.IO Error");
  console.log(err.stack); // this is changed from your code in last comment
  //location.reload();
  console.log("-->need reload video??");
});

