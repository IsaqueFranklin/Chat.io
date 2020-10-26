//Carregando módulos
const express = require('express')
const handlebars = require('express-handlebars')
const bodyParser = require('body-parser')
const app = express()
const session = require('express-session')
const flash = require('connect-flash')
const path = require('path')
var http =  require('http').createServer(app);
const io = require('socket.io')(http)


//Configuração

app.use(session({
  secret: 'buteco',
  resave: true,
  saveUninitialized: true
}))

app.use(flash())

//Middleware

app.use(function(req, res, next){
  res.locals.success_msg = req.flash('success_msg')
  res.locals.error_msg = req.flash('error_msg')
  next()
})


//bodyParser

app.use(bodyParser.urlencoded({extend: true}))
app.use(bodyParser.json())

//handlebars

app.engine('handlebars', handlebars({defaultLayout: 'main'}))
app.set('view engine', 'handlebars');

//Public

app.use(express.static(path.join(__dirname, 'public')))

//Rotas

app.get('/', function(req, res){
  res.render('index')
})

let messages = [];

io.on('connection', (socket) => {
  console.log('socket conectado:', socket.id);

  socket.emit('previousMessages', messages);

  socket.on('sendMessage', (data) => {
    messages.push(data);
    socket.broadcast.emit('receivedMessage', data)
  });
});




//Iniciando o servidor

const PORT = process.env.PORT || 3000
http.listen(PORT, () => {
  console.log("Servidor rodando!")
})
