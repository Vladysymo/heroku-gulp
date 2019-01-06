//Requires
const express = require('express')
const app     = express()
const http    = require('http').Server(app)
const io      = require('socket.io')(http)
const path    = require('path')
const fs      = require('fs')
const PORT    = process.env.PORT || 3000



//Settings for node.js app
app.use(express.static(path.join(__dirname, 'public')))
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')



//Requests
app.get('/', (req, res)=>{
	res.render('index.ejs')
})

console.log('hello')

//Socket.io functions
io.on('connection', (socket) => {

	console.log('a user connected ' + socket.id)

	socket.on('disconnect', ()=>{
		console.log('user diconnected ' + socket.id)
	})

	socket.on('send', (e)=>{
		console.log(`User with id: ${e} sended info`)
		io.emit('response', e)
	})

})



//Express listen
http.listen(PORT, () => console.log(`listenning on port: ${ PORT }`))