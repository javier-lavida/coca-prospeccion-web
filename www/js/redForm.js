var submitData = undefined;
var map = undefined;
var marker = undefined;
var position = undefined;


function getRedMarkers(){
  $.get(app.webserver + 'api/report-locations?kind=R', function(data){
    if(data.status == 200){
      var locations = data.report_locations;
      for(var i=0; i<locations.length; i++){
        var location = locations[i];
        var lat_lng = new google.maps.LatLng(location.latitude,location.longitude);
        var pinColor = "FE7569";
        switch(location.kind){
          case 'G':
            pinColor = '08A100';
            break;
          case 'Y':
            pinColor = 'EBDB00';
            break;
          case 'R':
            pinColor = 'CF0000';
            break;
          
        }

        var pinImage = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|" + pinColor,
            new google.maps.Size(21, 34),
            new google.maps.Point(0,0),
            new google.maps.Point(10, 34));
        var pinShadow = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_shadow",
            new google.maps.Size(40, 37),
            new google.maps.Point(0, 0),
            new google.maps.Point(12, 35));

        var redMarker = new google.maps.Marker({
            position: lat_lng,
            title: "Reporte " + location.id,
            location_id : location.id,
            map: map,
            animation: google.maps.Animation.DROP,
            icon: pinImage,
            shadow: pinShadow
        });

      }
    }
  });
}

function sendData(){
  $.post(app.webserver + 'api/red-store', submitData + '&latitude=' + position.coords.latitude
    + '&longitude=' + position.coords.longitude + '&accuracy=' + position.coords.accuracy,
    function(data){
      
      if(data.status == 200){
        navigator.notification.alert('Se ha guardado el reporte con id: ' + data.report_id, undefined, 'Reporte guardado');
        $.mobile.navigate('menu.html')
      }else if(data.status == 500){
        navigator.notification.alert('Hubo error al guardar el reporte. Este mensaje será más extenso en futuras versiones de la aplicacion'
          , undefined, 'Error');
      }

    }).fail(function(jqXHR, textStatus, error){
      console.log(jqXHR, textStatus, error);
    });
}

function onredNavigationSuccess(positionSuccess){
  position = positionSuccess;

  $('#red-map-popup').popup('open');
  
}

function onredNavigationFail(){
  navigator.notification.alert('code: '    + error.code    + '\n' +
        'message: ' + error.message + '\n');
}

$(function(){
  $('#red-form').submit(function(e){
    e.preventDefault();
    submitData = $(this).serialize();
    navigator.geolocation.getCurrentPosition(onredNavigationSuccess, onredNavigationFail);

  });

  $('#red-popup-save').click(sendData);

  
  $('#red-map-popup').on({
    popupafteropen : function(){
      if(!map){
        map = initMap('red-map-canvas', position);
        getRedMarkers();
      }else{
        marker = setMarker(position, map, marker);
      }
      
    }
  });
});