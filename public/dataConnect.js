
//Start connection
function dataconnect(userId) {
    hostConnection = myPeer.connect(userId);

    hostConnection.on('open', () => {
        console.log(`[hostConnection] Connection to ${hostConnection.peer} established.`,);
        if (!clientConnections.has(hostConnection.peer)) {
            clientConnections = clientConnections.set(
                hostConnection.peer,
                hostConnection,
            );
            // userNameMap = userNameMap.set(
            //     hostConnection.peer,
            //     myName,
            // );
        }
        // if (userNameMap.get(hostConnection.peer) = null){
        //     var mess = `${hostConnection.peer} joined.`;
        // } else {
        //     var mess = `${userNameMap.get(hostConnection.peer)} joined.`;
        // }
        const data = {
            sender: 'SYSTEM',
            message: `${hostConnection.peer} joined.`,
            // message: mess,
        };

        updatePeerList();
        updateMessageBoard(data.sender, data.message);

        // broadcast({
        //     ...data,
        //     peers: generatePeerList(),
        // });

        // document.getElementById(
        //     'hostId',
        // ).innerText = `Last user connected was: ${hostConnection.peer}.`;

    })

    hostConnection.on('data', (data) => {
        console.log('[hostConnection1] Recvied data:\n', data);
        updateMessageBoard(data.sender, data.message);
        updatePeerList(data.peers);
    })

    //hostConnection.send('Hello!');

    hostConnection.on('close', () => {
        console.log(
            `[Starter1] Connection to ${hostConnection.peer} is closed.`,
        );
        clientConnections = clientConnections.delete(
            hostConnection.peer.toString(),
        );
        userNameMap = userNameMap.delete(
            hostConnection.peer.toString(),
        );
        if (peers[hostConnection.peer]) {
            peers[hostConnection.peer].close()  //to close video
        }
        const data = {
            sender: 'SYSTEM',
            message: `${hostConnection.peer} left.`,
        }
        updatePeerList();
        updateMessageBoard(data.sender, data.message);
    
        // broadcast({
        //     ...data,
        //     peers: generatePeerList(),
        // })

        //myPeer.destroy();
        //location.reload();
    })
}


function updatePeerList(peerList) {
    // myName = document.getElementById('hostIdVal').value;
    document.getElementById('peerList').innerText = peerList
        ? peerList
        : generatePeerList();
}

function generatePeerList() {
    console.log('[generatePeerList] data:\n', 
        clientConnections
        .map((connection) => connection.peer)
        .toList()
        .push(`${peerId}`)
        .join(' ')
    );



    return clientConnections
        .map((connection) => connection.peer)
        .toList()
        .push(`${peerId}`)
        .join(' ');
}

// function join(userId) {
//     console.log("--run Join--")
//     hostConnection = myPeer.connect(
//         userId,
//     );

//     hostConnection.on('open', () => {
//         console.log(
//             `Connection to ${hostConnection.peer} established.`,
//         );

//         document.getElementById(
//             'hostId',
//         ).innerText = `CONNECTED TO ${hostConnection.peer}.`;
//     });

//     hostConnection.on('data', (data) => {
//         console.log('[hostConnection2] Recvied data:\n', data);
        
//         updateMessageBoard(data.sender, data.message);
//         updatePeerList(data.peers);
        
//     });

//     hostConnection.on('close', () => {
//         console.log(
//             `[Starter2]  Connection to ${hostConnection.peer} is closed.`,
//         );

//         if (peers[hostConnection.peer]) {
//             peers[hostConnection.peer].close()  //to close video
//         }
//         //myPeer.destroy();

//         //location.reload();
//     });
// }

function updateMessageBoard(id, message) {
    console.log('updateMessageBoard, id: ' + id);
    console.log('updateMessageBoard, myId: ' + myId.toString());
    console.log('updateMessageBoard, test: ' + message.includes(myId.toString()));
    if ((id != myId && id != 'SYSTEM') || (id == 'SYSTEM' && !message.includes(myId.toString()))) {
        document.getElementById(
            'messageBoard',
        ).innerText += `[${id}]: ${message}\n`;
    }

}



function broadcast(data) {
    // clientConnections.forEach((conn) => {
    //     conn.send(data);
    //     console.log('sent to peer: ' + conn.peer.toString());
        
    // }
    // );
    clientConnections.map((connection) => connection.send(data));
    // if (hostConnection.peer != null) {
    //     console.log('1-hostConnection-- SSS' + JSON.stringify(data));
    //     hostConnection.send(data);
    // }

    // if (connection.peer != null) {
    //     console.log('2-connection-- SSS' + JSON.stringify(data));
    //     connection.send(data);
    // }
}

function send() {
    const data = {
        sender: peerId,
        message: document.getElementById('message').value,
    };
    console.log('Sent data:\n', data);

    // if (hostConnection) {
    //     console.log('1-hostConnection-- SSS' + JSON.stringify(data));
    //     hostConnection.send(data);
    // } else if (connection) {
    //     console.log('2-connection-- SSS' + JSON.stringify(data));
    //     connection.send(data);
    // } 
    // else 
    if (!clientConnections.isEmpty()) {
        console.log('sent from clientConnections');
        broadcast({
            ...data,
            peers: generatePeerList(),
        });

        // updateMessageBoard(data.sender, data.message);
        document.getElementById(
            'messageBoard',
        ).innerText += `[${myName}]: ${data.message}\n`;
    }

    document.getElementById('message').value = '';
}

function handleKeyPress(e) {
    console.log('handleKeyPress sent by key');
    var key = e.keyCode || e.which;
    if (key == 13) {
        console.log('sent by enter key');
        send();
    }
}

function userNameUpdate(e) {
    if (document.getElementById('username').value != ''){
        myName = document.getElementById('username').value;
        document.getElementById('selfName').innerText = 'Your name: ' + myName;
    }

}

function handleUserNameUpdate(e) {
    var key = e.keyCode || e.which;
    if (key == 13) {
        userNameUpdate();
    }
}

function clear() {

    document.getElementById('message').innerText = '';
}

function hide(element) {
    element.classList.add('hidden');
}

function show(element) {
    element.classList.remove('hidden');
}
