var express = require('express');

var app = express();

// 设置handlebars视图引擎
var handlebars = require('express3-handlebars')
    .create({
        defaultLayout: 'main',
        helpers: {
            section: function(name, options) {
                if (!this._sections) this._sections = {};
                console.log(name, options, this._sections, '~~~~~~');
                this._sections[name] = options.fn(this);
                return null;
            }
        }
    });
var formidable = require('formidable');

var jqupload = require('jquery-file-upload-middleware');

var nodemailer = require('nodemailer');

var smtpTransport = require('nodemailer-smtp-transport');

var fortunes = [
    "Conquer your fears or they will conquer you",
    "Rivers need aprings.",
    "Do not fear what you don't know",
    "You will have a pleasant surprise.",
    "Whenever possible, keep it simple"
];

var tours = [
    { id: 0, name: 'Hood River', price: 99.99 },
    { id: 1, name: 'Oregon Coast', price: 149.95 }
];

var transporter = nodemailer.createTransport({
    service: 'smtp.163.com',
    port: 25, // SMTP 端口
    secureConnection: true, // 使用 SSL
    auth: {
        user: '18137702933',
        pass: 'duima316256' //授权码,通过163获取
    }
});
transporter.sendMail({
    form: '18137702933@163.com',
    to: '1051518597@qq.com',
    subject: 'nodemailer2.5.0邮件发送', // 标题
    text: 'Hello world', // 文本
    html: `<h2>nodemailer基本使用:</h2><h3><a href="http://blog.csdn.net/zzwwjjdj1/article/details/51878392">
    		http://blog.csdn.net/zzwwjjdj1/article/details/51878392</a></h3>`,
}, function(err, info) {
    if (err) { console.log(err); return; }
    console.log('发送成功');
});

function getWeatherData() {
    return {
        locations: [{
                name: 'Portland',
                forecastUrl: 'http://www.wunderground.com/US/OR/Portland.html',
                iconUrl: 'http://icons-ak.waug.com/i/c/k/cloudy.gif',
                weather: 'Overcast',
                temp: '54.1 F (12.3 C)',
            },
            {
                name: 'Bend',
                forecastUrl: 'http://www.wunderground.com/US/OR/Bend.html',
                iconUrl: 'http://icons-ak.waug.com/i/c/k/partlycloudy.gif',
                weather: 'Partly Cloudy',
                temp: '55.0 F (12.8 C)',
            },
            {
                name: 'Manzanita',
                forecastUrl: 'http://www.wunderground.com/US/OR/Manzanita.html',
                iconUrl: 'http://icons-ak.waug.com/i/c/k/rain.gif',
                weather: 'Light Rain',
                temp: '54.1 F (12.3 C)',
            },
        ]
    }
}


if (app.thing === null) console.log('bleat!');

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.use(express.static(__dirname + '/public'));
app.use(require('body-parser')());
// app.use(require('cookie-parser')(credentials.cookieSecret));
app.use(require('express-session')());
app.use(function(req, res, next) {
    res.locals.showTests = app.get('env') !== 'production' && req.query.test === '1';

    if (!res.locals.partials) res.locals.partials = {};
    res.locals.partials.weather = getWeatherData();
    next();
});

app.set('port', process.env.PORT || 3000);

app.get('/', function(req, res) {
    //res.type('text/plain');
    //res.send('Meadowlark Travel');
    res.render('home');
});

app.get('/about', function(req, res) {
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

app.get('/headers', function(req, res) {
    res.set('Content-Type', 'text/plain');
    var s = '';
    for (var name in req.headers) s += name + ': ' + req.headers[name] + '\n';
    res.send(s);
});

app.get('/tours/hood-river', function(req, res) {
    res.render('tours/hood-river');
});

app.get('/tours/request-group-rate', function(req, res) {
    res.render('tours/request-group-rate');
});

// app.get('/api/tours', function(req, res) {
// 	res.json(tours);
// });

app.get('/api/tours', function(req, res) {
    var toursXml = '<?xml version="1.0" ?><tours>' + tours.map(function(p) {
        return '<tour price="' + p.price + '" id="' + p.id + '">' + p.name + '</tour>';
    }).join('\n') + '<tours>';

    var toursText = tours.map(function(p) {
        return p.id + ': ' + p.name + ' (' + p.price + ')';
    }).join('\n');

    res.format({
        'application/json': function() {
            res.json(tours);
        },
        'application/xml': function() {
            res.type('application/xml');
            res.send(toursXml);
        },
        'text/xml': function() {
            res.type('text/xml');
            res.send(toursXml);
        },
        'text/plain': function() {
            res.type('text/plain');
            res.send(toursXml);
        }
    });
});

app.get('/jquerytest', function(req, res) {
    res.render('jquerytest');
})

app.get('/newsletter', function(req, res) {
    res.render('newsletter', { csrf: 'CSRF token goes here' });
})

app.post('/process', function(req, res) {
    if (req.xhr || req.accepts('json,html') === 'json') {
        res.send({ success: true });
    } else {
        console.log('From (from querystring):' + req.query.form);
        console.log('CSRF token (from hidden form field):' + req.body._csrf);
        console.log('Name (from visible form field):' + req.body.name);
        console.log('Email (from visible form field):' + req.body.email);
        res.redirect(303, '/about');
    }
});

app.get('/contest/vacation-photo', function(req, res) {
    var now = new Date();
    res.render('contest/vacation-photo', {
        year: now.getFullYear(),
        month: now.getMonth()
    });
});

app.post('/contest/vacation-photo/:year/:month', function(req, res) {
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
        if (err) return res.redirect(303, '/error');
        console.log('received fields');
        console.log(fields);
        console.log('received files:');
        console.log(files);
        res.redirect(303, '/about');
    })
})

app.use('/upload', function(req, res, next) {
    var now = Date.now();
    jqupload.fileHandler({
        upLoadDir: function() {
            return __dirname + '/punlic/uploads/' + now;
        },
        uploadUrl: function() {
            return '/uploads/' + now;
        },
    })(req, res, next);
});

// api用于更新一条数据并且返回JSON；参数在查询字符串中传递
app.put('/api/tour/:id', function(req, res) {
    var p = tours.some(function(p) { return p.id == req.params.id });
    if (p) {
        if (req.query.name) p.name = req.query.name;
        if (req.query.price) p.price = req.query.price;
        res.json({ success: true });
    } else {
        res.json({ error: 'No such tour exits.' });
    }
});

// api用于删除一个产品
app.delete('/api/tour/:id', function(req, res) {
    var i;
    for (var i = tours.length - 1; i >= 0; i--) {
        if (tours[i].id == req.params.id) break;
        if (i >= 0) {
            tours.splice(i, 1);
            res.json({ success: true });
        } else {
            res.json({ error: 'No such tour exists.' });
        }
    }
})
// 定制404页面
app.use(function(req, res) {
    res.status(404);
    res.render('404');
});

// 定制500页面
app.use(function(err, req, res, next) {
    console.log(err.stack);
    res.status(500);
    res.render('500');
});

app.listen(app.get('port'), function() {
    console.log('Express started in '+ app.get('env') +' mode on http://localhost:' + app.get('port') + '; press Ctrl-c to teminate');
});