const wsUrl = 'ws://localhost:8080/',
    wsPath = 'socketServer/';

let ws = null;

const loginBtn = document.querySelector('#login'),
    sendBtn = document.querySelector('#send'),
    wsWrap = document.querySelector('#wsWrap'),
    msgWrap = document.querySelector('#msgWrap');

const loginFn = async () => {
    const id = document.querySelector('#id').value;
    ws = await conncetWS(id, messageHandle);
    document.querySelector('#fromId').innerHTML = id;
    wsWrap.className = 'hide';
    msgWrap.className = 'show';
};

wsWrap.addEventListener('keypress', (e) => {
    if (e.keyCode == 13) {
        loginFn();
    }
});

loginBtn.addEventListener('click', loginFn);

const sendFn = () => {
    let msgObj = {
        toId: document.querySelector('#sendId').value,
        type: document.querySelector('#sendType').value,
        data: document.querySelector('#sendMsg').value
    };
    if (msgObj.toId) {
        // ws.send(JSON.stringify(msgObj));
        ws.sendTo(msgObj.toId, msgObj.type, msgObj.data);
    }
};

msgWrap.addEventListener('keypress', (e) => {
    if (e.keyCode == 13) {
        sendFn();
    }
})

sendBtn.addEventListener('click', sendFn);

function messageHandle(msgData) {
    const { fromId, type, data } = msgData;
    document.querySelector('#messgae').innerHTML = data;
    switch (type) {
        case '':
            
            break;
    
        default:
            break;
    }
}

function conncetWS(uid, msgHandle) {

    if ( ! WebSocket.prototype.sendTo ) {
        WebSocket.prototype.sendTo = function(toId, type, data) {
            const msg = JSON.stringify({ toId, type, data });
            this.send(msg);
        }
    }

    return new Promise((resolve, reject) => {

        const ws = new WebSocket(`${wsUrl}${wsPath}${uid}`);
        ws.onopen = () => {
            console.log('open');
            resolve(ws);
        };
        ws.onclose = () => {
            console.log('close');
        };
        ws.onerror = () => {
            console.log('error');
        };
        ws.onmessage = (msg) => {
            msgHandle(JSON.parse(msg.data));
        };
    });

};