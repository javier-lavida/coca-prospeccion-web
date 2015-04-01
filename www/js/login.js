$(function(){

  $('#login-form').submit(function(e){

    e.preventDefault();

    var postData = $(this).serialize();
    console.log("serveeeer",app.webserver + 'api/login');
    $.post(app.webserver + 'api/login', postData, function(data){
      console.log(data);
      if(data.status == 200){
        navigator.notification.alert(data.msg, undefined, 'Inicio de sesión');

        $.mobile.navigate('menu.html');
      }else if(data.status == 500){
        navigator.notification.alert(data.error_msg, undefined, 'Inicio de sesión');
      }
    }).fail(function(jqXHR, textStatus, error){
      console.log('Error');
      navigator.notification.alert(textStatus, undefined, 'Inicio de sesión');
      console.log(jqXHR, textStatus, error);
    });
  });
});