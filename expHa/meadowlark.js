var express = require('express');

var app = express();

// 设置handlebars视图引擎
var handlebars = require('express3-handlebars')
	.create({ defaultLayout: 'main' });

var fortunes = [
	"Conquer your fears or they will conquer you",
	"Rivers need aprings.",
	"Do not fear what you don't know",
	"You will have a pleasant surprise.",
	"Whenever possible, keep it simple"
];

if( app.thing === null ) console.log('bleat!');

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.use(express.static(__dirname + '/public'));

app.use(function(req, res, next){
	res.locals.showTests = app.get('env') !== 'production' && req.query.test === '1';
	next();
});

app.set('port', process.env.PORT || 3000);

app.get('/', function(req, res){
	//res.type('text/plain');
	//res.send('Meadowlark Travel');
	res.render('home');
});

app.get('/about', function(req, res){
	//res.type('text/plain');
	//res.send('About Meadowlark Travel');
	// var randomFortune = fortunes[Math.floor(Math.random() * fortunes.length)];
	var fortune = require('./lib/fortune.js');
	res.render('about', {
		fortune: fortune.getFortune(),
		pageTestScript: '/qa/tests-about.js'
	});
	// res.render('about', { fortune: randomFortune });
});

app.get('/headers', function(req, res){
	res.set('Content-Type', 'text/plain');
	var s = '';
	for(var name in req.headers) s += name + ': ' + req.headers[name] + '\n';
	res.send(s);
});

app.get('/tours/hood-river', function(req, res){
	res.render('tours/hood-river');
});

app.get('/tours/request-group-rate', function(req, res){
	res.render('tours/request-group-rate');
});

// 定制404页面
app.use(function(req, res){
	res.status(404);
	res.render('404');
});

// 定制500页面
app.use(function(err, req, res, next){
	console.err(err.stack);
	res.status(500);
	res.render('500');
});

app.listen(app.get('port'), function(){
	console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-c to teminate');
});

