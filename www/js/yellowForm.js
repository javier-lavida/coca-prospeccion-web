var submitData = undefined;
var map = undefined;
var position = undefined;


function sendData(){
  $.post(app.webserver + 'api/yellow-store', submitData + '&latitude=' + position.coords.latitude
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

function onYellowNavigationSuccess(positionSuccess){
  position = positionSuccess;

  $('#yellow-map-popup').popup('open');
  
}

function onYellowNavigationFail(){
  navigator.notification.alert('code: '    + error.code    + '\n' +
        'message: ' + error.message + '\n');
}

$(function(){
  $('#yellow-form').submit(function(e){
    e.preventDefault();
    submitData = $(this).serialize();
    navigator.geolocation.getCurrentPosition(onYellowNavigationSuccess, onYellowNavigationFail);

  });

  $('#yellow-popup-save').click(sendData);


  $('#yellow-map-popup').on({
    popupafteropen : function(){
      if(!map){
        map = initMap('yellow-map-canvas', position);
      }else{
        marker = setMarker(position, map, marker);
      }
      
    }
  });
});