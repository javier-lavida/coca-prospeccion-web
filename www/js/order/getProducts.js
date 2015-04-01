
$('#products-page').on('pageshow', function(){
  

  category = getParameterByName('category');

  if(category != undefined)
    $.get(app.webserver + 'api/products/' + category, function(data){
      if(data.status == 200){
        products = data.products;
        var mainDiv = $('#products');
        for(var i=0; i<products.length; i++){
          product = products[i];

          var a = $('<a>').attr({
            'href' : '#addRemoveProductPopup',
            'data-rel' : 'popup',
            'data-transition' : 'slideup',
            'app-target-idx' : i,
            'app-target-id' : product.id,
          
          });
          console.log('id-producto', product.id);

          var h2 = $('<h4>').html(product.description);
          var h3 = $('<h5>').html('$' + product['box_price']);
          var p = $('<p>').html(product.size);

          var aCount = $('<span>').attr({
            'class': 'ui-li-count'
          }).html('0');

          var li = $('<li>').attr({
            'style' : 'white-space: normal;'
          });

          var wrapper = $('<div>').attr({'class': 'split-custom-wrapper'})
          a.append(h2);
          a.append(h3);
          a.append(p);
          a.append(aCount);
          // wrapper.append(aAdd);
          // wrapper.append(aCount);
          // wrapper.append(aMin);
          li.append(a);
          //li.append(wrapper)
          mainDiv.append(li);
          li.trigger('create');
        }
        mainDiv.listview('refresh');
      }
    }).fail(function(jqXHR, textStatus, error){
      navigator.notification.alert(textStatus, undefined, 'Error al obtener productos');

      console.log(jqXHR, textStatus, error);
    });


  $('#addProductsAnchor, #removeProductsAnchor').click(function(){
    var ar = $(this).is('#addProductsAnchor') ? 1 : -1;
    var actualVal = $("#addRemoveProductPopup #popupCount").text();
    var actualVal = parseInt(actualVal);
    if(ar < 0 && actualVal == 0) return;
    actualVal = actualVal + (ar);
    console.log('valor actuaaaaal',actualVal);
    $("#addRemoveProductPopup #popupCount").text(actualVal);
  });

  $('#addRemoveProductPopup').on('popupafterclose', function(){
    var targetIdx = $(this).attr('app-target-idx');
    console.log('targetIdx', targetIdx);
    if(targetIdx == undefined) return;
    targetIdx = parseInt(targetIdx);
    $($('#products li')[targetIdx]).find('.ui-li-count').text($(this).find('#popupCount').text());
  });
});

$('.send-order-btn').click(function(){
  var btn = $(this);
  console.log('enviando');
  var diccionario ={}
  $('#products li .ui-li-count').filter(function(){

    console.log('Aqui');
    return parseInt($(this).html()) !== 0;
  }).each(function(){
    var id= $(this).parents('a').attr('app-target-id');
    var quantity = parseInt($(this).html());
    console.log('id', id);
    console.log('quantity', parseInt($(this).html()));
    diccionario[id]= quantity;

  });
    console.log(diccionario);
    var valor;
    app.db.transaction(function(tx) {
      tx.executeSql("select value  as val from config where key = 'lastGreenReport'", [], function(tx, res) {
        //console.log("res.rows.length: " + res.rows.length + " -- should be 1");
        console.log("valor " + res.rows.item(0).val);
        valor = res.rows.item(0).val;
        $.post(app.webserver+'api/order-store',{products:diccionario,report_id:valor},function(data){
          console.log(data);
          navigator.notification.alert('se ha guardado el pedido', undefined, '');
          if(btn.is('.send-order-close')){
            $.mobile.navigate('menu.html');
          }else{
            $.mobile.navigate('order.html');
          }
          
        });
      });
    },function(e){console.log("ERROR "+ e.message);});
});


$('body').on('click', '#products > li > a', function(){
  var desc = $(this).children('h4').html();
  var size = $(this).children('p').html();

  var count = $(this).children('.ui-li-count').text();

  $('#addRemoveProductPopup #popupTitle').html(desc);
  $('#addRemoveProductPopup #popupContent').html(size);
  $('#addRemoveProductPopup #popupCount').text(count);


  console.log('clicked target', $(this).attr('app-target-idx'));

  $('#addRemoveProductPopup').attr('app-target-idx', $(this).attr('app-target-idx'));
  $('#addRemoveProductPopup').attr('app-target-id', $(this).attr('app-target-id'));

});