
$( document ).ready(function() {
  $.ajax({
    url: 'https://accounts.spotify.com/api/token',
    type: 'post',
    data: {
        "grant_type": "client_credentials"
    },
    headers: {
        Authorization: 'Basic ZTlmOGRiMTE5ZjFhNDQ5M2JmOTM3NmU3MzE3NmM5ZmI6MTY5ZWQ5YTViZjk2NDIzNDhlMGJkMDBlODE2YWI2MzU=',
        "Content-Type": 'application/x-www-form-urlencoded'
    },
    success: function(data) {
        console.log(data);
    }
});
});
