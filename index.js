require('dotenv').config()
const morgan = require('morgan')
const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const { connectDb } = require('./config/dbConnection')
const userRouter = require('./routers/userRouter')
const adminRouter = require('./routers/adminRouter')
const trainerRouter = require('./routers/trainerRouter')
const chatRouter = require('./routers/chatRouter')
const paymentRouter = require('./routers/paymentRouter')
require('dotenv').config()

const app = express()

app.use(morgan('dev'))
app.use(cors())
app.use(express.json({ limit: '100mb', extended: true }))
app.use(cookieParser())

app.use('/user', userRouter)
app.use('/admin', adminRouter)
app.use('/trainer', trainerRouter)
app.use('/chat', chatRouter)
app.use('/payment', paymentRouter)


connectDb()
const server = app.listen(process.env.PORT, () => {
    console.log('server started');
})

const io = require('socket.io')(server, {
    cors: {
        origin: process.env.SOCKETURL,
        credentials: true
    }
})

io.on('connection', (socket) => {

    socket.on('setup', (userId) => {
        socket.join(userId)
        socket.emit('connected')
    })

    socket.on('joinChat', (room) => {
        socket.join(room);
    })

    socket.on('new message', (newMessage, room) => {
        io.emit('messageResponse', newMessage, room);
    });

    socket.on('disconnect', () => {
        console.log("Socket disconnected");
    });
})


// io.of("/chat").on("connection", (socket) => {
//     socket.on("setup", (userId) => {
//       socket.join(userId);
//     });
//   console.log(socket.id);
//     socket.on("newMessage", (message, chatId,storeId) => {
//       io.of("/chat").emit("messageResponse", message, chatId,storeId);
//       addMessage(chatId, message);
//     });
  
//     socket.on("read", (chatId, storeId) => {
//       markMessagesAsRead(chatId, storeId);
//       io.of("/chat").emit("readResponse", chatId, storeId);
//     });
//     socket.on("typing", (isTyping, Id, storeId) => {
//       io.of("/chat").emit("typing", isTyping, Id, storeId);
//     });
//   });



{ /*CRON*/ }

const { spawn } = require('child_process');

const deleteExpiredSubscriptionsProcess = spawn('node', ['deleteExpiredSubscriptions.js']);

deleteExpiredSubscriptionsProcess.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
});

deleteExpiredSubscriptionsProcess.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
});

deleteExpiredSubscriptionsProcess.on('close', (code) => {
    console.log(`Child process exited with code ${code}`);
});