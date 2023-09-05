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


const app = express()

app.use(morgan('dev'))
app.use(cors())
app.use(express.json({ limit: '100mb', extended: true }))
app.use(cookieParser())

app.use('/user', userRouter)
app.use('/admin', adminRouter)
app.use('/trainer', trainerRouter)
app.use('/chat', chatRouter)


connectDb()
const server = app.listen(process.env.PORT, () => {
    console.log('server started');
})

const io = require('socket.io')(server, {
    cors: {
        origin: 'http://localhost:5173',
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