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
const ObjectId = mongodb.ObjectId;
const session = require('express-session');// Vai controlar no backend, a sessão que o usuário está usando, armazenar  infos
const MONGODB_URI = 'mongodb://localhost:27017/jedi';

app.use(express.static(path.join(__dirname, 'public')));//Todos os arquivos nessa pasta serão visiveis

app.set('views', path.join(__dirname, 'views'));
app.set('view engine','ejs');

app.use(session({
	secret: 'jedi',
	resave: false,
	saveUninitialized: false //referencia de manter conectado, quando set para true, vai ser necessário passar outros parâmetros
}));

app.use(bodyParser.urlencoded({extended: true})); //Vai permitir adicionar texto, imagens, GIF's

app.get('/', (req, res) => {
	if (req.session.user) {
		mongoClient.connect(MONGODB_URI, (err, db) => {
			const usuarios = db.collection('usuarios');
			usuarios.find({'_id': new ObjectId(req.session.user.id)}).toArray((err, docs) => {
				db.close();
				res.render('home', {nome: docs[0].nome});
			});
		});
	} else {
		res.render('cadastro-login');
	}
});

app.post('/login', (req, res) => {
	const email = req.body.email;
	const senha = req.body.senha;

	mongoClient.connect(MONGODB_URI, (err, db) => {
		const usuarios = db.collection('usuarios');
		usuarios.find({
			'email': email,
			'senha': senha
		}).toArray((err, docs) => {
			if (docs.length === 0) {
				res.render('home', {nome: 'Usuário não cadastrado'});	
			} else {
				req.session.user = {id: docs[0]._id};
				res.redirect('/');				
			}

			db.close();
		});
	});
});

app.post('/cadastrar', (req, res) => {
	mongoClient.connect(MONGODB_URI, (err, db) => {
		const usuarios = db.collection('usuarios');

		const usuario = req.body;
		usuario.posts = [];

		usuarios.insertOne(usuario, (err, result) => {
			db.close();

			req.session.user = {id: result.ops[0]._id};
			res.redirect('/');
		});
	});
});

app.post('/postagem', (req, res) => {
	mongoClient.connect(MONGODB_URI, (err, db) => {
		const usuarios = db.collection('usuarios');
		usuarios.find({'_id': new ObjectId(req.session.user.id)}).toArray((err, docs) => {
			const posts = docs[0].posts;
			posts.push({
				texto: req.body.texto
			});

			usuarios.updateOne({'_id': new ObjectId(docs[0]._id)},
				{$set: {posts: posts}}, (err, results) => {
					db.close();
					res.redirect('/');
			});
		});
	});
});

app.get('/logout', (req, res) => {
	delete req.session.user;
	res.redirect('/');
});

app.listen(3000, () => {
  console.log('Example app listening on port 3000!');
});