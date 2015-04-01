function initMap(canvas_id, position){
  try{
    var mapOptions = {
      center: new google.maps.LatLng(19.4129947,-99.1366783),
      zoom: 14,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      disableDefaultUI: true
    };
    map = new google.maps.Map(document.getElementById(canvas_id),
        mapOptions);

    if(position)
      setMarker(position, map);

    return map;
  }catch(e){
    console.log(e);
    return undefined;
  }
}

function setMarker(position, map, prevMarker){

  try{
    if(prevMarker)
      prevMarker.setMap(null);
    
          
    var marker = new google.maps.Marker({
      position: new google.maps.LatLng(position.coords.latitude, position.coords.longitude),
      map: map,
      icon: 'img/ico_curr_pos.png'
    });

    map.setCenter(new google.maps.LatLng(position.coords.latitude, position.coords.longitude));
    
    return marker;
  }catch(e){
    console.log(e);
    return undefined;
  }
}