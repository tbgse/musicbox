var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var YouTube = require('youtube-node');
require('dotenv').config();
var port = process.env.PORT || 8090;
var youTube = new YouTube();

youTube.setKey(process.env.YOUTUBE_API_KEY);


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
   extended: true
}));
app.use(express.static(__dirname+'/public'))

app.post('/search/youtube',function(req,res){
  console.log(req.body.search);
  youTube.search(req.body.search, 5, function(error, result) {
    if (error) {
      console.log(error);
      res.end();
    }
    else {
      console.log(JSON.stringify(result, null, 2));
      res.send(result);
    }
  });
})

app.get('/', function (req, res) {
  res.sendFile(process.cwd()+'/public/home.html')
})



app.listen(port);
