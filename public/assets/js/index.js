
$( document ).ready(function() {

  $('.music-service-button.youtube').css('display', 'inline-block')
  $('.music-service-button.youtube').addClass('active')
  $('.music-player-container.youtube').css('display', 'block')

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
                    $('.music-player-iframe.spotify').attr('src', 'https://open.spotify.com/embed?uri=spotify%3Aalbum%3A' + response.id)
                    $('.music-service-button.spotify').css('display', 'inline-block')



                    $.ajax({
                           url: "https://api.spotify.com/v1/artists/"+ response.artists[0].id,
                           type: "GET",
                           beforeSend: function(xhr){xhr.setRequestHeader('Authorization', 'Bearer ' + token);},
                           success: function(res) {

                             $('.artist-photo-url').attr('href', res.external_urls.spotify)
                             $('.artist-photo').css('background-image', 'url("'+ res.images[0].url +'")')

                            }
                    });

                    $.ajax({
                           url: "https://api.spotify.com/v1/recommendations?limit=5&seed_artists="+ response.artists[0].id,
                           type: "GET",
                           beforeSend: function(xhr){xhr.setRequestHeader('Authorization', 'Bearer ' + token);},
                           success: function(resp) {

                             resp.tracks.forEach(function(track,rec_no){
                               $('.vinyl-art-cover-' + rec_no).attr('src', track.album.images[0].url)
                               var albumCont = track.album.name.length > 20 ? "..." : ''
                               $('.album-description.'+ rec_no + ' .album-title').html(track.album.name.slice(0,20) + albumCont )

                               $('.item.disc-'+rec_no + ' .album-link').attr('href', track.album.external_urls.spotify)
                               // console.log('.item.disc-'+rec_no + ' .album-link',$('.item.disc-'+rec_no + ' a.album-link').attr('href'),track.album.external_urls.spotify)

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


      $.ajax({
             url: "https://api.music.apple.com/v1/catalog/us/search?term=2014+Forest+Hills+Drive&limit=1&types=albums",
             type: "GET",
             beforeSend: function(xhr){xhr.setRequestHeader('Authorization', 'Bearer ' + 'eyJhbGciOiJFUzI1NiIsImtpZCI6Ikg3VlJaNDZSMzcifQ.eyJpc3MiOiIzNTI1OTZaM1NDIiwiZXhwIjoxNTMyOTc0MDA2LCJpYXQiOjE1MjIxOTcwMDZ9.m40hOAQwOKi1B0afQuZgirh8fD9sBdVgG6Q1wWNcHCUDXpfCzOi04QNNRYwfRWDlP1RrEmu96l80qjTREyxAzw');},
             success: function(res) {
               $('.music-player-iframe.apple').attr('src', 'https://tools.applemusic.com/embed/v1/album/'+ res.results.albums.data[0].id +'?country=us')
               $('.music-service-button.apple').css('display', 'inline-block')
              }
      });




      var $apple = $('.music-service-button.apple').on('click', function(){
        removeActiveMusicServiceButton()
        hideActiveEmbed()
        $('.music-player-container.apple').css('display', 'block')
        $apple.addClass('active')
      })
      var $spotify = $('.music-service-button.spotify').on('click', function(){
        removeActiveMusicServiceButton()
        hideActiveEmbed()
        $('.music-player-container.spotify').css('display', 'block')
        $spotify.addClass('active')
      })
      var $youtube= $('.music-service-button.youtube').on('click', function(){
        removeActiveMusicServiceButton()
        hideActiveEmbed()
        $('.music-player-container.youtube').css('display', 'block')
        $youtube.addClass('active')
      })


      function hideActiveEmbed(){
        $('.music-player-container').css('display', 'none')
      }

      function removeActiveMusicServiceButton(){
        $apple.removeClass('active')
        $spotify.removeClass('active')
        $youtube.removeClass('active')
      }

      $('.carousel-control').on('click', function(){
        $('#carousel-example-generic').carousel({
          interval: 5000
        })
      })

});



function roundMinutes(ms){
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
