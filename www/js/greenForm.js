var submitData = undefined;
var map = undefined;
var marker = undefined;
var position = undefined;

function onGreenNavigationSuccess(positionSuccess){
  
  position = positionSuccess;
  
  $('#green-map-popup').popup('open');
    
}

function errorCB(error){
  console.log(error);
  alert('Error processing Sql ' +error.code);
}


function sendData(){
  $.post(app.webserver + 'api/green-store', submitData + '&latitude=' + position.coords.latitude
    + '&longitude=' + position.coords.longitude + '&accuracy=' + position.coords.accuracy,
    function(data){
      if(data.status == 200){
        console.log('data report id', data.report_id);
        app.db.transaction(function(tx) {
          // tx.executeSql("select *  from config", [], function(tx, res) {
          //   console.log("res.rows.length: " + res.rows.length + " -- should be 1");
           
          // });
          tx.executeSql("UPDATE config SET VALUE = ?  WHERE KEY = 'lastGreenReport'",[data.report_id],function(tx,res){
            console.log("rowsAffected: " + res.rowsAffected + " -- should be 1");
          });
        },function(e){console.log("ERROR "+ e.message);});
        $.mobile.navigate('register_ok.html?report-id='+ data.report_id);
      }else if(data.status == 500){
        // TODO
        navigator.notification.alert('Hubo error al guardar el reporte. Este mensaje será más extenso en futuras versiones de la aplicacion', undefined, 'Error');
      }
    }).fail(function(jqXHR, textStatus, error){
      console.log(jqXHR, textStatus, error);
    });
}

function onGreenNavigationFail(){
  navigator.notification.alert('code: '    + error.code    + '\n' +
        'message: ' + error.message + '\n');
}

$(function(){

  
  $('#green-form').submit(function(e){
    e.preventDefault();
    submitData = $(this).serialize();
    navigator.geolocation.getCurrentPosition(onGreenNavigationSuccess, onGreenNavigationFail);

  });

  $('#green-popup-save').click(sendData);


  $('#green-map-popup').on({
    popupafteropen : function(){
      if(!map){
        map = initMap('green-map-canvas', position);
      }else{
        marker = setMarker(position, map, marker);
      }
      
    }
  });

});




