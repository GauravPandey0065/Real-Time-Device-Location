const express = require('express');
const path = require('path');
const http = require('http');
const socketio = require('socket.io');

// Initialize Express and HTTP server
const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Set EJS as the view engine
app.set('view engine', 'ejs');

// Serve static files (CSS, JS) from the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// Socket.io connection
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('send-location', (data) => {
        console.log('Location data received:', data);
        io.emit('recieve-location', { id: socket.id, ...data });
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected:', socket.id);
        io.emit('user-disconnected', socket.id);
   
    });
});

// Route for the main page
app.get('/', (req, res) => {
    try {
        res.render('index'); // Render the EJS template
    } catch (err) {
        console.error('Error rendering index.ejs:', err);
        res.status(500).send('Internal Server Error');
    }
});

// Start the server on port 3000
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log('Server running on http://localhost:3000');
});
