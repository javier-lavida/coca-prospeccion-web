$(function(){

  $.get(
    app.webserver + 'api/categories',
    function(data){
      if(data.status == 200){
        var categories = data.categories;

        var mainDiv = $('#categories');

        for(var i=0; i<categories.length; i++){

          var category = categories[i];

          var link = $('<a>').attr({'href' : 'orderstep2.html?category='+category.id, 'data-role' : 'button', 'class' : "ui-btn"});
          var img = $('<img>').attr({'src' : app.webserver + category['cover_url'], 'class' : 'page-header-img', 'alt' : category.name});
          var klass = undefined;
          switch((i+1)%2){
            case 1:
              klass= 'ui-block-a';
              break;
            // case 2:
            //   klass= 'ui-block-b';
            //   break;
            case 0:
              klass= 'ui-block-b';
              break;
          }

          var div = $('<div>').attr({'class' : klass});
          mainDiv.append(div);
          div.append(link);
          link.append(img);
        }


      }
    }
  );

});
