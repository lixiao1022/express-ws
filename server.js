const express = require('express');
const express_ws = require('express-ws');
const path = require('path');
const app = express();
const wsObj = {};
express_ws(app);

app.use(express.static('src'));

app.get('/', (req, res) => {
    res.sendFile('/src/index.html');
});

app.ws('/socketServer/:uid', (ws, req) => {
    const uid = req.params.uid;
    wsObj[uid] = ws;
    ws.onmessage = (msg) => {
        let { toId, type, data} = JSON.parse(msg.data);
        const fromId = uid;
        if (fromId != toId && wsObj[toId]) {
            wsObj[toId].send(JSON.stringify( { fromId, type, data } ))
        }
    }
});

app.listen(8080);