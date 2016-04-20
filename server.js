var express = require('express')
var app = express()
var port = process.env.PORT || 8080;

app.use(express.static(__dirname+'/public'))

app.get('/', function (req, res) {
  res.sendFile(process.cwd()+'/public/home.html')
})

app.post('/search',function(req,res){

})

app.listen(port);
