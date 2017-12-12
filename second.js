var fs = require("fs");
// var data = fs.readFileSync('input.txt');
// console.log(data.toString());

fs.readFile('input.txt', function (err, data) {
    if(err) return console.error(err.stack);
    console.log(data.toString());
})
console.log('程序执行结果');