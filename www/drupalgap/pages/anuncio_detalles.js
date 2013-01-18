var drupalgap_page_node;
var drupalgap_page_anuncio_detalles_aid = -1; // other's set this nid so this page knows which node to load
$('#drupalgap_page_anuncio').live('pageshow',function(){
    try {
        
        if(drupalgap_page_anuncio_detalles_aid != -1){
            //$('#btnModificar').attr("href", "anuncios_update.html");
            obtener_anuncio(drupalgap_page_anuncio_detalles_aid);
        }
        else
        {
            alert("El id del anuncio no es válido");
            return;
        }
    //        var query = $(this).data("url").split("?")[1];
    //        if(query){
    //            if(query.indexOf('aid') != -1){
    //                anuncio_id = query.replace("aid=","");
    //                $('#btnModificar').attr("href", "anuncios_add.html?update="+anuncio_id);
    //                obtener_anuncio(anuncio_id);
    //            }            
    //        
    //        }
    }
    catch (error) {
        console.log("drupalgap_page_node");
        console.log(error);
    }
});

$('#btnDelete').live('click',function(){
    
    eliminar_anuncio(drupalgap_page_anuncio_detalles_aid);
});



$('#drupalgap_page_node_button_edit').live("click",function(){
    // Set the node edit nid.
    drupalgap_page_node_edit_nid = drupalgap_page_node_nid;
});

function eliminar_anuncio(id){
    views_options_p = {
        "endpoint" : "mclasificados",
        "path" : "delete",
        "data" : "id_anuncio="+id,
        "success" : eliminar_anuncio_success,
        "error" : eliminar_anuncio_error
    };  
    
            
    anuncios_retrieve.resource_call(views_options_p);
}

function eliminar_anuncio_error(){
    
}
function eliminar_anuncio_success(content){
    if(content.success == true)
        alert("Anuncio eliminado satisfactoriamente");
    else
        alert("En estos momentos no podemos atender su petición. Inténtelo más tarde");
    
    $.mobile.changePage("anuncios.html");
}


function obtener_anuncio(id){
    views_options_p = {
        "endpoint" : "mclasificados",
        "path" : "retrieve",
        "data" : "id_anuncio="+id,
        "success" : obtener_anuncio_success,
        "error" : obtener_anuncio_error
    };  
    
            
    anuncios_retrieve.resource_call(views_options_p);    
}

function obtener_anuncio_success(anuncio){
    //alert(anuncio.data.titulo);
    var titulo_html = '<span style="padding-right:5em;"><b>T&iacute;tulo:</b></span><span>'+anuncio.data.titulo+'</span>';
    var precio_html = '<span style="padding-right:5em;"><b>Precio:</b></span><span>'+anuncio.data.precio+'</span>';
    var descripcion_html = '<span style="padding-right:2em;"><b>Descripci&oacute;n:</b></span><span>'+anuncio.data.descripcion+'</span>';
    var categoria_html = '<span style="padding-right:3em;"><b>Categor&iacute;a:</b></span><span>'+anuncio.data.nombreSeccion+'</span> > <span>'+anuncio.data.nombreCategoria+'</span>';
    var provincia_html = '<span style="padding-right:3em;"><b>Provincia:</b></span><span>'+anuncio.data.nombreProvincia+'</span>';
    var fecha_html = '<span style="padding-right:3em;"><b>Fecha:</b></span><span>'+anuncio.data.fechaSubida+'</span>';
    var anunciante_html = '<span style="padding-right:3em;"><b>Anunciante:</b></span><span>'+anuncio.data.nombreContacto+'</span>';
    var correo_anunciante_html = '<span style="padding-right:3em;"><b>Correo:</b></span><span>'+anuncio.data.correoContacto+'</span>';
    
    var images_html = '';
    
    if(anuncio.data.NImagenAnuncio[0]){
        images_html = '<div>Im&aacute;genes:</div><br />';
        $.each(anuncio.data.NImagenAnuncio,function(index,value){
            images_html += '<div style="float:left;margin-left:2em;margin-bottom:1em"><img src="'+drupalgap_settings.site_path + "/sites/default/files/images/thumbs/"+value.nombre+'" /></div>'
        });
    }
    
    
    
    $('#drupalgap_page_anuncio .titulo').html(titulo_html);
    $('#drupalgap_page_anuncio .precio').html(precio_html);
    $('#drupalgap_page_anuncio .descripcion').html(descripcion_html);
    $('#drupalgap_page_anuncio .categoria').html(categoria_html);
    $('#drupalgap_page_anuncio .provincia').html(provincia_html);
    $('#drupalgap_page_anuncio .fecha').html(fecha_html);
    $('#drupalgap_page_anuncio .anunciante').html(anunciante_html);
    $('#drupalgap_page_anuncio .correoanunciante').html(correo_anunciante_html);
    
    $('#drupalgap_page_anuncio .images').html(images_html);
    
    
    
    activate_buttons(anuncio);
    
}

function obtener_anuncio_error(){
    
}


function activate_buttons(anuncio){
    
    if((drupalgap_user.uid == 1) || (drupalgap_user.uid == anuncio.data.idUsuario)) 
        $('#action_buttons').show();
}