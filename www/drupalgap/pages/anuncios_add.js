var anuncio_id;
var select_changed = false;
var imagenes_cont = 1;
var files_selected = [];

var prov_loaded = false;
var cat_loaded = false;
var secc_loaded = false;



$('#drupalgap_page_anuncios_add').live('pageshow',function(){
    
    drupalgap_page_provincia_pid = -1;
    drupalgap_page_categoria_cid = -1;
    
    drupalgap_page_anuncio_detalles_aid = -1;
    
    if(select_changed)
    {
        select_changed = false;   
        return;
    }
   
    imagenes_cont = 1;
    files_selected = [];
    
    prov_loaded = false;
    cat_loaded = false;
    secc_loaded = false;

    try {
        

        load_secciones_select();    
        load_provincias_select();
       
        document.getElementById('imgAdd1').src = drupalgap_settings.site_path + '/sites/default/files/images/nophoto.png';
        
    }
    catch (error) {
        console.log("drupalgap_page_content_add - " + error);
    }
    
});





$('.btnEliminarImagenSelect').live('click',function(){
    
    var count = $(this).attr('id').split("Eliminar")[1];
    
    
    
    var div = this.parentNode;
    div.parentNode.removeChild(div);
    imagenes_cont--;
    
    for(var index = 0;index < files_selected.length;index++){
        if(files_selected[index].id == count){
            files_selected.remove(index);
            break;
        }
    };
});

$('.image_add_select').live('click',function(){
    adicionar_selector_imagen();
    
    
});


$('.image_select').live('click',function(){
    
    var esto = this;
    navigator.camera.getPicture(onSuccess, onFail, {
        quality: 50,
        destinationType: Camera.DestinationType.DATA_URL,
        sourceType : Camera.PictureSourceType.SAVEDPHOTOALBUM
    }); 

    function onSuccess(imageData) {
        seleccionar_imagen_from_camera(esto,imageData);        
    }

    function onFail(message) {
        //alert('Failed because: ' + message);
    }

});


$('#btnFormAceptar').live('click',function(){
    
    
    var titulo = $("#titulo").val();
    var precio = $("#precio").val();
    var descripcion = $("#descripcion").val();
    var tipo = $("#tipo").val();
    
    var categoria = $("#categoria").val();
    var provincia = $("#provincia").val();
    
    if(!valid_inputs())return;
    
    var options = {
        "endpoint" : "mclasificados",
        "save_to_local_storage" : "0",
        "path" : "submit",
        "data" : "files="+encodeURIComponent(JSON.stringify(files_selected))+
        "&titulo="+titulo+"&precio="+precio+"&descripcion="+descripcion+"&tipo="+
        tipo+"&categoria="+categoria+"&provincia="+provincia,
        "success" : anuncios_create_success,
        "error" : anuncios_create_error,
    };
 
    if(drupalgap_page_anuncio_detalles_aid != -1)
        options.data += "&id="+drupalgap_page_anuncio_detalles_aid;
    
    
    drupalgap_services_anuncio_CRUD.resource_call(options);
});

$('#drupalgap_page_anuncios_add_form select').live('change',function(){
    
    select_changed = true;
});

$('#seccion').live('change',function(){
    var seccion = $("#seccion").val();
    
    load_categorias_select(seccion);
});

$('.btnEliminarImagen').live('click',function(){
    delete_image($(this).attr('id'));

});
function seleccionar_imagen_from_camera(a,imageData){
    var count = $(a).attr('id').split("Add")[1];    
    
    
    var image = document.getElementById('imgAdd'+count);
    
    image.src = "data:image/jpeg;base64," + imageData;
    
    var img = {
        "id" : count,
        "data" : imageData
    };
    files_selected.push(img);
}

function adicionar_selector_imagen(){
    
    imagenes_cont++;
    var div = '<div class="imagenes_select">'+
    '<img src="'+drupalgap_settings.site_path + '/sites/default/files/images/nophoto.png" id="imgAdd'+imagenes_cont+'" style="width: 50px;height: 50px;"/>'+
    '<input type="button" id="btnAdd'+imagenes_cont+'" data-mini="true" class="image_select" data-inline="true" data-icon="picture" value="Seleccionar" data-theme="b" />'+
    '<a href="#" id="lnkEliminar'+imagenes_cont+'" class="btnEliminarImagenSelect">Elminar</a>'+
    '</div>';
          
    $("#imagenes_selectors_set").append(div);
    $("#btnAdd"+imagenes_cont).button();
    

}

function anuncios_create_error(jqXHR, textStatus, errorThrown){
    console.log(error);
}
function anuncios_create_success(content){
    if(content.success == true){
        
                
        //alert("Anuncio guardado satisfactoriamente");
        
        $.mobile.changePage('anuncios.html');
    }
        
}


function load_secciones_select(){
    
    
    views_options_c = {
        "endpoint" : "mclasificados",
        "path" : "secciones/view",
        //"data" : "start="+cat_start+"&limit="+max_items,
        "success" : secciones_select_success,
        "error" : secciones_select_error
    };
         
    anuncios_retrieve.resource_call(views_options_c);                
    
}

function secciones_select_error(jqXHR, textStatus, errorThrown){
    //console.log("drupalgap_page_user_edit");
    console.log(error);
}

function secciones_select_success(content){
    if ($(content.data).length > 0) {
        $.each(content.data,function(index,value){                          
            $("#seccion").append("<option value='"+value.id+"'>"+value.nombre+"</option>");                            
                            
        });
                        
    }
    else {
        html = "Lo sentimos, no hay contenido para mostrar.";
        $("#seccion").append($("<option></option>",{
            "html":html
        }));
    }
    if(drupalgap_page_anuncio_detalles_aid != -1)
        $("#seccion").val(anuncio_obj.idSeccion);
    // Refresh the list.
    $("#seccion").selectmenu('refresh',true);  
    
    
    
    var seccion = $("#seccion").val();
    
    load_categorias_select(seccion);
    
    secc_loaded = true;
    
    if((prov_loaded == true) && (cat_loaded == true) && (secc_loaded == true))
        form_activate_buttons();

}

function form_activate_buttons(){
    
    $('#form_action_buttons').show();
}


function obtener_anuncio_update(id){
    views_options_p = {
        "endpoint" : "mclasificados",
        "path" : "retrieve",
        "data" : "id_anuncio="+id,
        "success" : obtener_anuncio_update_success,
        "error" : obtener_anuncio_update_error
    };  
    
            
    anuncios_retrieve.resource_call(views_options_p);    
}

function obtener_anuncio_update_error(jqXHR, textStatus, errorThrown){
    
}

function obtener_anuncio_update_success(content){
    anuncio_obj = content.data;
    
    load_data_form();
}


function load_data_form(){
    $("#titulo").val(anuncio_obj.titulo);
    $("#precio").val(anuncio_obj.precio);
    
    $("#tipo").val(anuncio_obj.tipo);
    // Refresh the list.
    $("#tipo").selectmenu('refresh',true); 
    
    $("#descripcion").val(anuncio_obj.descripcion);
    
    load_secciones_select();    
    load_provincias_select();
    
    show_images();
}

function delete_image(id){
    for(var index = 0;index < anuncio_obj.NImagenAnuncio.length;index++){
        //$.each(anuncio_obj.NImagenAnuncio,function(index,value){
        if(anuncio_obj.NImagenAnuncio[index].id == id){
            anuncio_obj.NImagenAnuncio.remove(index);
            break;
        }       
    }
    

    show_images();
    
    views_options_c = {
        "endpoint" : "mclasificados",
        "path" : "images/delete",
        "data" : "id_imagen="+id,
    //"success" : image_delete_success,
    //"error" : image_delete_error
    };
        
    
    anuncios_retrieve.resource_call(views_options_c);
}

function show_images(){
    var images_html = '';
    
    if(anuncio_obj.NImagenAnuncio[0]){
        images_html = '<div>Im&aacute;genes:</div><br />';
        $.each(anuncio_obj.NImagenAnuncio,function(index,value){
            images_html += '<div style="float:left;margin-left:2em;margin-bottom:1em;text-align:center;">'+
            '<img src="'+drupalgap_settings.site_path + "/sites/default/files/images/thumbs/"+value.nombre+'" />'+
            '<a id="'+value.id+'" class="btnEliminarImagen" href="#" style="display:block;overflow:hidden;">Eliminar</a></div>';
        });
    }
    
    $('#drupalgap_page_anuncios_edit_form .imagenes').html(images_html);
    
    $('#drupalgap_page_anuncios_edit_form .imagenes').append("<div style='clear: both;overflow: hidden;'></div>");
}

function load_categorias_select(seccion_id){
         
    views_options_c = {
        "endpoint" : "mclasificados",
        "path" : "categorias/view",
        "data" : "id_seccion="+seccion_id,
        "success" : categorias_select_success,
        "error" : categorias_select_error
    };
        
    
            
    anuncios_retrieve.resource_call(views_options_c);                
    
}

function categorias_select_error(jqXHR, textStatus, errorThrown){
    //console.log("drupalgap_page_user_edit");
    console.log(error);
}

function categorias_select_success(content){
    $("#categoria").html("");
    if ($(content.data).length > 0) {
        $.each(content.data,function(index,value){
                          
            $("#categoria").append("<option value='"+value.id+"'>"+value.nombre+"</option>");                            
                            
        });
                        
    }
    else {
        html = "Lo sentimos, no hay contenido para mostrar.";
        $("#categoria").append($("<option></option>",{
            "html":html
        }));
    }
    if(drupalgap_page_anuncio_detalles_aid != -1)
        $("#categoria").val(anuncio_obj.idCategoria);     
        
    // Refresh the list.
    $("#categoria").selectmenu('refresh',true);    
    
    cat_loaded = true;
    if((prov_loaded == true) && (cat_loaded == true) && (secc_loaded == true))
        form_activate_buttons();
    
    

}


function load_provincias_select(){
         
    views_options_c = {
        "endpoint" : "mclasificados",
        "path" : "provincias/view",       
        "success" : provincias_select_success,
        "error" : provincias_select_error
    };
        
    anuncios_retrieve.resource_call(views_options_c);                
    
}

function provincias_select_error(jqXHR, textStatus, errorThrown){
    //console.log("drupalgap_page_user_edit");
    console.log(error);
}

function provincias_select_success(content){
    
    
    if ($(content.data).length > 0) {
        $.each(content.data,function(index,value){
                          
            $("#provincia").append("<option value='"+value.id+"'>"+value.nombre+"</option>");                            
                            
        });
                        
    }
    else {
        html = "Lo sentimos, no hay contenido para mostrar.";
        $("#provincia").append($("<option></option>",{
            "html":html
        }));
    }
    if(drupalgap_page_anuncio_detalles_aid != -1)
        $("#provincia").val(anuncio_obj.idProvincia); 
   
    // Refresh the list.
    $("#provincia").selectmenu('refresh',true);    
    
    prov_loaded = true;
    if((prov_loaded == true) && (cat_loaded == true) && (secc_loaded == true))
        form_activate_buttons();
    
   
    
}

function valid_inputs(){
    var titulo = $("#titulo").val();
    var precio = $("#precio").val();
    var descripcion = $("#descripcion").val();
    
    if(titulo == "" || precio == ""){
        alert("Los campos en negritas son obligatorios");
        return false;
    }
   
    var intRegex = /^\d+$/;
    var floatRegex = /^((\d+(\.\d *)?)|((\d*\.)?\d+))$/;

    if(!intRegex.test(precio) || !floatRegex.test(precio)) {
        alert('El valor del precio debe ser un número');
        return false;
    }else
    
        return true;
}

function reset_formulario(){
    $("#titulo").val("");
    $("#precio").val("0");
    $("#descripcion").val("");
    
    var div_html = '<img src="#" id="imgAdd1" style="width: 75px;height: 75px"/> '+
    '<input type="button" id="btnAdd1" data-mini="true" class="image_select" data-inline="true" value="Seleccionar" data-icon="plus" data-theme="b" />'+
    '<a href="#" id="lnkEliminar1" class="btnEliminarImagenSelect">Elminar</a>';
    
    $(".imagenes_select").remove();
    imagenes_cont = 1;
    
    adicionar_selector_imagen();
    
}