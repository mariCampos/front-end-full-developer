/*var express = require('express');
var app = express();

app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});*/

const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const mongodb = require('mongodb');
const mongoClient = mongodb.MongoClient;

app.use(express.static(path.join(__dirname, 'public')));//Todos os arquivos nessa pasta serão visiveis

app.set('views', path.join(__dirname, 'views'));
app.set('view engine','ejs');

app.use(bodyParser.urlencoded({extended: true})); //Vai permitir adicionar texto, imagens, GIF's

app.get('/', (req, res) => {
  res.render('inicial');
});

app.post('/cadastrar',(req,res) => {
	mongoClient.connect('mongodb://localhost:27017/jedi', function(err, db){
		const usuarios = db.collection('usuarios');
		usuarios.insertOne(req.body, function(err, result){
			console.log(result.ops[0]);
			res.send('Cadastrou!');
		});
	});	
});

app.listen(3000, () => {
  console.log('Example app listening on port 3000!');
});