var activeSong = 1;
var playingSong = false;
var pausedSong = false;
var shuffleCounter = 0;
var shuffle = false;
var searchTimeout;
var looped = false;
var randomSongOrder = [];
var timeElapsed = 0;
var progressAmount = 0;
var activeSongDuration = 249;
var songs = [{
  title: "Flip",
  artist: "Glass Animals",
  album: "Zaba",
  duration: 214,
  rating: 4,
  image: "https://upload.wikimedia.org/wikipedia/en/3/32/Glass_animals_zaba.jpg",
  videoId: "DnUvBgC7RNY"
}, {
  title: "Black Mambo",
  artist: "Glass Animals",
  album: "Zaba",
  duration: 249,
  rating: 3,
  image: "https://upload.wikimedia.org/wikipedia/en/3/32/Glass_animals_zaba.jpg",
  videoId: "H7bqZIpC3Pg"
}, {
  title: "Stay Close",
  artist: "Flume",
  album: "Flume",
  duration: 176,
  rating: 5,
  image: "https://upload.wikimedia.org/wikipedia/en/8/8e/Flume_album_artwork.jpg",
  videoId: "IEnkzvJRbTw",
}, {
  title: "Loud Places",
  artist: "Romy, Jamie xx",
  album: "In Colour",
  duration: 283,
  rating: 4,
  image: "https://upload.wikimedia.org/wikipedia/en/c/c2/Jamie_xx_-_In_Colour.png",
  videoId: "TP9luRtEqjc"
}, {
  title: "You & Me (Flume Remix)",
  artist: "Disclosure, Flume",
  album: "Settle",
  duration: 280,
  rating: 5,
  image: "https://upload.wikimedia.org/wikipedia/en/7/76/Disclosure_-_Settle.png",
  videoId: "_zPlr-o-YEQ"
}, {
  title: "Retrograde",
  artist: "James Blake",
  album: "Overgrown",
  duration: 214,
  rating: 3,
  image: "https://upload.wikimedia.org/wikipedia/en/d/de/James_Blake_-_Overgrown_album_cover.png",
  videoId: "6p6PcFFUm5I"
},
            {
  title: "Retrograde",
  artist: "James Blake",
  album: "Overgrown",
  duration: 214,
  rating: 3,
  image: "https://upload.wikimedia.org/wikipedia/en/d/de/James_Blake_-_Overgrown_album_cover.png",
  videoId: "6p6PcFFUm5I"
}]
songs.forEach(function(song, num) {
  var tr = document.createElement('tr');
  var songName = document.createElement('td');
  songName.appendChild(document.createTextNode(song.title));
  var artistName = document.createElement('td');
  artistName.appendChild(document.createTextNode(song.artist));
  var albumName = document.createElement('td');
  albumName.appendChild(document.createTextNode(song.album));
  var duration = document.createElement('td');
  duration.appendChild(document.createTextNode(beautifySeconds(song.duration)));
  var rating = document.createElement('td');
  for (var i = 0; i < 5; i++) {
    var star = document.createElement('i');
    star.classList.add('fa')
    if (song.rating > i) star.classList.add('fa-star');
    else star.classList.add('fa-star-o');
    rating.appendChild(star)
  }
  tr.appendChild(songName);
  tr.appendChild(artistName);
  tr.appendChild(albumName);
  tr.appendChild(duration);
  tr.appendChild(rating);
  tr.id = 'song-' + num;
  tr.addEventListener('click', function(e) {
    if (activeSong !== parseInt(this.id.match(/\d/g).join(''))) {
      pausedSong = false;
      updateSong(songs[parseInt(this.id.match(/\d/g).join(''))]);
    }
  })
  $('#song-table').appendChild(tr);
})
$('#song-' + activeSong).classList.add('selected-song');

function updateSong(song) {
  player.loadVideoById(song.videoId);
     $('#song-' + activeSong).classList.remove('selected-song');
    $('#album-background-overlay').style.backgroundImage = 'url(' + songs[activeSong].image + ')';
    activeSong = songs.indexOf(song);
    resetSongProgress();
  $('#album-image').style.backgroundImage = 'url(' + song.image + ')';
  $('#album-background').style.backgroundImage = 'url(' + song.image + ')';
  $('#current-song-title').innerHTML = song.title;
  $('#current-song-artist').innerHTML = song.artist;
  window.requestAnimationFrame(function() {
    fadeIn($('#album-background-overlay'), 0);
  });
  $('#song-' + activeSong).classList.add('selected-song');
      $('#progress-line-overlay').style.transition = 'all .1s linear';

}

$('#forward').addEventListener('click', function() {
  if (shuffle) {
    nextSongShuffle();
  }
  else if (activeSong < songs.length - 1) {
    updateSong(songs[activeSong+1]);
  }

})
$('#backward').addEventListener('click', function() {
  if (activeSong > 0) {
    updateSong(songs[activeSong-1]);
  }
})
$('#volume-bar').addEventListener('click',function(e){
  setVolume(e);
})
function fadeIn(elm, x) {
  if (x < 1) {
    x += 0.1;
    $('#album-background-overlay').style.opacity = 1 - x;
    window.requestAnimationFrame(function() {
      fadeIn(elm, x)
    })
  } else {

  }
}

$('#play').addEventListener('click',function(){
  if(!playingSong){
    if (!pausedSong) {
      player.seekTo(0,true);
      resetSongProgress();
    if (shuffle) {
      createRandomSongOrder();
    }
    }
    player.playVideo();
    startSongProgress();
  $('#play').innerHTML = '<i class="fa fa-pause" aria-hidden="true"></i>'
  }
  else {
    player.pauseVideo();

  pauseSong();
  }

});
$('#playlist-button').addEventListener('click',function(){
  $('#sidebar').classList.toggle('active');
  $('body').classList.toggle('active')
})
$('#shuffle').addEventListener('click',function(){
 this.classList.toggle('active');
  if (!shuffle) {
    shuffle = true;
    createRandomSongOrder();
  }
  else shuffle = false;

});
$('#loop').addEventListener('click',function(){
 this.classList.toggle('active');
});
$('#progress-line').addEventListener('mousedown',function(e){
  setProgressbar(e);
})
function startSongProgress() {
  $('#progress-line-overlay').style.transition = 'all .1s linear';
    playingSong = true;
    playInterval = setInterval(function(){
    timeElapsed += 1;
    if (timeElapsed >= activeSongDuration){
    if (shuffle){
      nextSongShuffle();
    }
    else {
       updateSong(songs[activeSong+1]);
    }
    }
    updateTime();
    updateProgressbar();
    },1000);
}

function pauseSong() {
    playingSong = false;
    pausedSong = true;
    $('#play').innerHTML = '<i class="fa fa-play" aria-hidden="true"></i>';
    clearInterval(playInterval);
}
function resetSongProgress() {
  $('#progress-line-overlay').style.transition = 'none';
     timeElapsed = 0;
      updateTime();
     $('#progress-line-overlay').style.width = $('#progress-line').clientWidth +'px';
}

function beautifySeconds(time){
  if (isNaN(time)) return "0:00";
  var min = Math.floor(time/60);
  var sec = Math.floor(time%60);
  if (sec < 10){
  return min+":0"+sec;
  }
  return min+":"+sec;
}
function updateTime() {
  timeElapsed = player.getCurrentTime();
          $('#active-time').innerHTML = beautifySeconds(timeElapsed);
}
function updateProgressbar() {
      var newWidth = $('#progress-line').clientWidth - progressAmount*timeElapsed;
    $('#progress-line-overlay').style.width = newWidth +'px';

}
function setProgressbar(e) {
  var factor = e.clientX / $('#progress-line').clientWidth ;
  timeElapsed = activeSongDuration * factor;
  player.seekTo(timeElapsed, true);
  updateProgressbar();
}

function createRandomSongOrder() {
  randomSongOrder = [];
  while (randomSongOrder.length <songs.length){
    var nextNumber = Math.floor(Math.random()*(songs.length));
    if(randomSongOrder.indexOf(nextNumber) < 0) {
        randomSongOrder.push(nextNumber)
    }
  }
  randomSongOrder.splice(randomSongOrder.indexOf(activeSong),1);
  console.log(randomSongOrder)
}

function nextSongShuffle(){
      updateSong(songs[randomSongOrder[shuffleCounter]]);
    shuffleCounter += 1;
    if (shuffleCounter >= songs.length-1){
      createRandomSongOrder();
      shuffleCounter = 0;
    }
}
// 2. This code loads the IFrame Player API code asynchronously.
var tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// 3. This function creates an <iframe> (and YouTube player)
//    after the API code downloads.
var player;
function onYouTubeIframeAPIReady() {
  player = new YT.Player('player', {
    height: '300',
    width: '534',
    playerVars: {
      controls:0,
      enablejsapi:1,
      showinfo:0,
      rel:0,
      iv_load_policy:3,
      fs:0,
      autoplay:0,
      modestbranding:1,

    },
    videoId: 'G6VPRMZWMqc',
    events: {
      'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange
    }
  });
}

// 4. The API will call this function when the video player is ready.
function onPlayerReady(event) {

}

// 5. The API calls this function when the player's state changes.
//    The function indicates that when playing a video (state=1),
//    the player should play for six seconds and then stop.
var done = false;
function onPlayerStateChange(event) {
  if (event.data === 1){
    var duration = player.getDuration();
    $('#total-time').innerHTML = beautifySeconds(duration);
    progressAmount = $('#progress-line').clientWidth/duration;
    activeSongDuration = duration;
    console.log(progressAmount)
  }
  if (event.data == YT.PlayerState.PLAYING && !done) {
    if(!playingSong){
      player.seekTo(5,true)
        player.pauseVideo();
    }

  }
}
function stopVideo() {
  player.stopVideo();
}

function setVolume(e) {
  if (e.layerY <= 0){
  $('#volume-line-overlay').style.height = 0;
  player.setVolume(100);
  }
  else if (e.layerY >= $('#volume-line').clientHeight) {
    $('#volume-line-overlay').style.height = $('#volume-line').clientHeight + 'px';
    player.setVolume(0);

  } else {
    $('#volume-line-overlay').style.height = (e.layerY-5) + 'px';
    console.log(Math.floor($('#volume-line').clientHeight- e.layerY/$('#volume-line').clientHeight*100))
    player.setVolume(Math.floor(Math.floor($('#volume-line').clientHeight- e.layerY/$('#volume-line').clientHeight*100)))
  }
}

$('#search-field').addEventListener('keyup',function(e){
 delay(function(){
   $('.black-overlay-2').classList.add('active')

   console.log(document.getElementById('search-field').value)
   $.fetch("/search/youtube",{
     method:"POST",
     data:"search="+document.getElementById('search-field').value,
     responseType:"json"
   }).then(function(data){
     console.log('success!')
     showYoutubeSearchResults(data.response.items);
   }).catch(function(err){
     console.log(err)
   })
 },300)

});

function showYoutubeSearchResults(results){
  var item;
  var searchNode = $('#search-list');
  while (searchNode.firstChild) {
    searchNode.removeChild(searchNode.firstChild);
}
  results.forEach(function(x){
    console.log(x.snippet.title)
    item = $.create("li",{
      contents:x.snippet.title
    })
    $('#search-list').appendChild(item);
  })
}

var delay = (function(){
  var timer = 0;
  return function(callback, ms){
    clearTimeout (timer);
    timer = setTimeout(callback, ms);
  };
})();
