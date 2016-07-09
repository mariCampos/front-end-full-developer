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

app.use(express.static(path.join(__dirname, 'public')));//Todos os arquivos nessa pasta serão visiveis

app.set('views', path.join(__dirname, 'views'));
app.set('view engine','ejs');

app.get('/', (req, res) => {
  res.render('inicial');
});

app.post('/cadastrar',(req,res) => {
	res.send('Cadastrou!');
})

app.listen(3000, () => {
  console.log('Example app listening on port 3000!');
});