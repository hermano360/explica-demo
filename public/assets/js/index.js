
$( document ).ready(function() {
  var searchQuery = window.location.href.split("?").length > 1 ? window.location.href.split("?").pop() : "2014+Forest+Hills+Drive"
  console.log(searchQuery)
  $.ajax({
         url: "https://www.googleapis.com/youtube/v3/search?part=snippet&q="+searchQuery+"&key=AIzaSyAphZf2PFTn8QR0C02-QbduW0sbswG07y8&type=playlist&maxResults=1",
         type: "GET",
         success: function(response) {
            $('.music-service-button.youtube').css('display', 'inline-block')

           $( ".music-player-container.app-container.youtube" ).append( '<iframe width="100%" src="'+'https://www.youtube.com/embed/videoseries?list=' +response.items[0].id.playlistId+'" frameborder="0" allow="autoplay; encrypted-media" height="'+($('.body').width()*.75).toString()+'"allowfullscreen></iframe>')
           removeActiveMusicServiceButton()
           $('.music-service-button.youtube').addClass('active')
           $('.music-service-button.youtube').click()
         }})

  $.ajax({
         url: "/token",
         type: "GET",
         success: function(token) {
           $.ajax({
                  url: "https://api.spotify.com/v1/search?query="+searchQuery+"&type=album&limit=1",
                  type: "GET",
                  beforeSend: function(xhr){xhr.setRequestHeader('Authorization', 'Bearer ' + token);},
                  success: function(resp) {
                    var response = resp.albums.items[0]
                    console.log(resp)
                    $('.album-art').css("background-image", 'url("'+response.images[0].url+'")')
                    $('.album-title').html(response.name)
                    $('.artist-photo-name').html(response.artists[0].name)
                    $('.album-artist').html(response.artists[0].name)
                    $('.music-service-button.spotify').css('display', 'inline-block')
                    $( ".music-player-container.app-container.spotify" ).append( '<iframe width="100%" src="'+'https://open.spotify.com/embed?uri=spotify%3Aalbum%3A' + response.id +'" frameborder="0" allow="autoplay; encrypted-media" height="'+($('.body').width()*.75).toString()+'"allowfullscreen></iframe>')
                    removeActiveMusicServiceButton()
                    $('.music-service-button.spotify').addClass('active')
                    $('.music-service-button.spotify').click()
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
             url: "https://api.music.apple.com/v1/catalog/us/search?term="+searchQuery+"&limit=1&types=albums",
             type: "GET",
             beforeSend: function(xhr){xhr.setRequestHeader('Authorization', 'Bearer ' + 'eyJhbGciOiJFUzI1NiIsImtpZCI6Ikg3VlJaNDZSMzcifQ.eyJpc3MiOiIzNTI1OTZaM1NDIiwiZXhwIjoxNTMyOTc0MDA2LCJpYXQiOjE1MjIxOTcwMDZ9.m40hOAQwOKi1B0afQuZgirh8fD9sBdVgG6Q1wWNcHCUDXpfCzOi04QNNRYwfRWDlP1RrEmu96l80qjTREyxAzw');},
             success: function(res) {
               $('.album-publisher').html(res.results.albums.data[0].attributes.recordLabel)
               $('.music-service-button.apple').css('display', 'inline-block')

              $( ".music-player-container.app-container.apple" ).append('<iframe class="music-player-iframe apple" src="'+'https://tools.applemusic.com/embed/v1/album/'+ res.results.albums.data[0].id +'?country=us'+'" width="100%" height="'+($('.body').width()*.75).toString()+'" frameborder="0"></iframe>')
              removeActiveMusicServiceButton()
              $('.music-service-button.apple').addClass('active')
              $('.music-service-button.apple').click()

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

      $('iframe').attr('height', ($('.body').width()*.75).toString())


      $( window ).resize(function() {
        $('iframe').attr('height', ($('.body').width()*.75).toString())
      });

      $('.carousel-inner.iframe').attr('height', ($('.body').width()*.75).toString())


      $( window ).resize(function() {
        $('.carousel-inner.iframe').attr('height', ($('.body').width()*.75).toString())
      });
      $('#carousel-example-generic1').attr('min-height', ($('.body').width()*.75).toString())


      $( window ).resize(function() {
        $('#carousel-example-generic1').attr('min-height', ($('.body').width()*.75).toString())
      });

      $('.music-service-button.apple').click(function(){
        $('.music-player-container.app-container.apple iframe').attr('src', $('.music-player-container.app-container.apple iframe').attr('src'));
        $('.music-player-container.app-container.spotify iframe').attr('src', $('.music-player-container.app-container.spotify iframe').attr('src'));
        $('.music-player-container.app-container.youtube iframe').attr('src', $('.music-player-container.app-container.youtube iframe').attr('src'));
      })
      $('.music-service-button.spotify').click(function(){
        $('.music-player-container.app-container.youtube iframe').attr('src', $('.music-player-container.app-container.youtube iframe').attr('src'));
        $('.music-player-container.app-container.apple iframe').attr('src', $('.music-player-container.app-container.apple iframe').attr('src'));
      })
      $('.music-service-button.youtube').click(function(){
        $('.music-player-container.app-container.apple iframe').attr('src', $('.music-player-container.app-container.apple iframe').attr('src'));
        $('.music-player-container.app-container.spotify iframe').attr('src', $('.music-player-container.app-container.spotify iframe').attr('src'));
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
