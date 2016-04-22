var express = require('express');
var app = express();
var request = require('request');
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
app.use(express.static(__dirname + '/public'))

youTube.addParam('embeddable', true);
youTube.addParam('type', 'video');

app.post('/search/youtube', function(req, res) {
  console.log(req.body.search);
  var resultArr = [];
  youTube.search(req.body.search, 5, function(error, result) {
    if (error) {
      console.log(error);
      res.end();
    } else {
      result.items.forEach(function(x) {
        resultArr.push(x.id.videoId);
      })
      resultArr = resultArr.join(',');
      request('https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=' + resultArr + '&key=' + process.env.YOUTUBE_API_KEY, function(error, response, body) {
        if (!error && response.statusCode == 200) {
          body = JSON.parse(body);
          console.log(body.items)

          result.items.forEach(function(x, i) {
            x.duration = body.items[i].contentDetails.duration
          })
          res.send(result);
        }
      })

    }
  });
})
app.post('/albumimage/youtube', function(req, res) {
  request('https://www.googleapis.com/youtube/v3/channels?part=snippet&id=' + req.body.channel + '&key=' + process.env.YOUTUBE_API_KEY, function(error, response, body) {
    if (!error && response.statusCode == 200) {
      body = JSON.parse(body);
      res.send(body.items[0])
    }
  })
})

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/public/home.html')
})



app.listen(port);
