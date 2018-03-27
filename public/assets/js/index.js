
$( document ).ready(function() {
  $.ajax({
         url: "/token",
         type: "GET",
         success: function(token) {
           $.ajax({
                  url: "https://api.spotify.com/v1/albums/7viNUmZZ8ztn2UB4XB3jIL",
                  type: "GET",
                  beforeSend: function(xhr){xhr.setRequestHeader('Authorization', 'Bearer ' + token);},
                  success: function(response) {
                    $('.album-art').css("background-image", 'url("'+response.images[0].url+'")')
                    $('.album-title').html(response.name)
                    $('.album-artist').html(response.artists[0].name)
                    $('.album-publisher').html(response.label)
                    $('.music-player-iframe').attr('src', 'https://open.spotify.com/embed?uri=spotify%3Aalbum%3A' + response.id)
                    $('.music-player-iframe').css('display', 'block')


                    console.log( response);

                    $.ajax({
                           url: "https://api.spotify.com/v1/artists/"+ response.artists[0].id,
                           type: "GET",
                           beforeSend: function(xhr){xhr.setRequestHeader('Authorization', 'Bearer ' + token);},
                           success: function(res) {
                             console.log( res);
                             $('.artist-photo-url').attr('href', res.external_urls.spotify)
                             $('.artist-photo').css('background-image', 'url("'+ res.images[0].url +'")')

                             console.log( res.images[0].url);
                            }
                    });

                    $.ajax({
                           url: "https://api.spotify.com/v1/recommendations?limit=5&seed_artists="+ response.artists[0].id,
                           type: "GET",
                           beforeSend: function(xhr){xhr.setRequestHeader('Authorization', 'Bearer ' + token);},
                           success: function(resp) {
                             console.log(resp)
                             resp.tracks.forEach(function(track,rec_no){
                               $('.vinyl-art-cover-' + rec_no).attr('src', track.album.images[0].url)
                               var albumCont = track.album.name.length > 20 ? "..." : ''
                               $('.album-description.'+ rec_no + ' .album-title').html(track.album.name.slice(0,20) + albumCont )

                               $('.item.disc-'+rec_no + ' .album-link').attr('href', track.album.external_urls.spotify)
                               console.log('.item.disc-'+rec_no + ' .album-link',$('.item.disc-'+rec_no + ' a.album-link').attr('href'),track.album.external_urls.spotify)

                               $.ajax({
                                      url: "https://api.spotify.com/v1/albums/"+ track.album.id,
                                      type: "GET",
                                      beforeSend: function(xhr){xhr.setRequestHeader('Authorization', 'Bearer ' + token);},
                                      success: function(album_response) {
                                        $('.album-description.'+ rec_no + ' .album-info')
                                          .html(album_response.release_date.split('-')[0] + ' ' + album_response.tracks.total + ' songs, ' + roundMinutes(totalMillisecondsInAlbum(album_response.tracks.items) ) )
                                      }})

                             })

                            }
                    });

                   }
               });
         }
      });

      var $apple = $('.music-service-button.apple').on('click', function(){
        removeActiveMusicServiceButton()
        $apple.addClass('active')
      })
      var $spotify = $('.music-service-button.spotify').on('click', function(){
        removeActiveMusicServiceButton()
        $spotify.addClass('active')
      })
      var $youtube= $('.music-service-button.youtube').on('click', function(){
        removeActiveMusicServiceButton()
        $youtube.addClass('active')
      })
      var $google= $('.music-service-button.google').on('click', function(){
        removeActiveMusicServiceButton()
        $google.addClass('active')
      })
      var $tidal= $('.music-service-button.tidal').on('click', function(){
        removeActiveMusicServiceButton()
        $tidal.addClass('active')
      })

      function removeActiveMusicServiceButton(){
        $apple.removeClass('active')
        $spotify.removeClass('active')
        $youtube.removeClass('active')
        $google.removeClass('active')
        $tidal.removeClass('active')
      }

      pauseCarousel()

});

function pauseCarousel(){
  console.log('damn it')
  $('#carousel-example-generic').carousel("pause")
}


function roundMinutes(ms){
  console.log(ms)
  var timeString = ''
  var hours = 0
  var minutes = 0
  if(ms > 3600000){
    hours = Math.floor(ms / 3600000)
  }
  if(ms > 60000) {
    minutes = Math.floor((ms % 3600000) / 60000 )
  }
  if(hours > 1){
    timeString += hours + ' hours '
  } else if(hours === 1) {
    timeString += hours + ' hour '
  }
  if(minutes > 1){
    timeString += minutes + ' minutes'
  } else if(minutes === 1) {
    timeString += minutes + ' minute'
  }

  if(hours === 0 && minutes === 0){
    timeString = '0 minutes'
  }
  return timeString
}

function totalMillisecondsInAlbum(track_collection){
  var totalMsCount = 0
  track_collection.forEach(function(track){
    totalMsCount += track.duration_ms
  })
  return totalMsCount
}
