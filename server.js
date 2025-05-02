// // Path: /server.js

// const { createServer } = require('http');
// const { parse } = require('url');
// const next = require('next');
// const { initSocket } = require('./src/lib/socket');

// const dev = process.env.NODE_ENV !== 'production';
// const app = next({ dev });
// const handle = app.getRequestHandler();

// app.prepare().then(() => {
//     const server = createServer((req, res) => {
//         const parsedUrl = parse(req.url, true);
//         handle(req, res, parsedUrl);
//     });

//     // Initialize Socket.IO
//     initSocket(server);

//     const PORT = process.env.PORT || 3000;
//     server.listen(PORT, () => {
//         console.log(`> Ready on http://localhost:${PORT}`);
//     });
// });

const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const { Server } = require('socket.io');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
    const server = createServer((req, res) => {
        const parsedUrl = parse(req.url, true);
        handle(req, res, parsedUrl);
    });

    const io = new Server(server, {
        cors: {
            origin: process.env.NEXT_PUBLIC_APP_URL || "https://careforindiansv2.vercel.app",
            methods: ["GET", "POST"],
            credentials: true,
            transports: ['websocket', 'polling']
        },
        // Add this configuration
        allowEIO3: true,
        path: '/api/socketio',
    });

    // Socket.IO logic
    require('./lib/socket')(io);

    const PORT = process.env.PORT || 3000;
    server.listen(PORT, () => {
        console.log(`> Ready on ${process.env.NEXT_PUBLIC_APP_URL || `http://localhost:${PORT}`}`);
    });
});