var drupalgap_page_provincia_pid = -1;
var drupalgap_page_categoria_cid = -1;

var scroll = false;


$('#anuncios-ver-mas').live('click',function(){
    
    $('#anuncios-ver-mas').hide();
            
    anun_start = anun_start + max_items_a;
    
    scroll = true;
    
    if(drupalgap_page_provincia_pid != -1)
        load_anuncios_provincias_list();
    else if(drupalgap_page_categoria_cid != -1)
        load_anuncios_categorias_list();
    else           
            
        load_anuncios_list();
            
            
            
    
});
        
        
$('#drupalgap_page_anuncios').live('pageshow',function(){
    try {
        max_items_a = 10;
        
        anun_start = 0;
        anuncios = [];

        
        if (drupalgap_user.uid == 0){
            $("#drupalgap_page_anuncios_button_add").attr("href", "informacion_anonimo.html");            
        }
        
        if(drupalgap_page_provincia_pid != -1)
            load_anuncios_provincias_list();
        else if(drupalgap_page_categoria_cid != -1)
            load_anuncios_categorias_list();
        else           
            
            load_anuncios_list();
    }
    catch (error) {
        console.log("drupalgap_page_anuncios");
        console.log(error);
    }
});

// When a content list item is clicked...
$('#drupalgap_page_anuncios_list a').live("click",function(){
    // Save a reference to the node id.
    drupalgap_page_anuncio_id = $(this).attr('id');
});


$('input[name=radio-view]').live("change",function(){
	
    var vista = $('input[name=radio-view]:checked').val();
        
        
    switch(vista){
        case "todos":
            $.mobile.changePage("anuncios.html");            
            
            
            break;        
       
    }
        
});

$('#drupalgap_page_anuncios_list a').live("click",function(){
    // Save a reference to the node id.
    drupalgap_page_anuncio_detalles_aid = $(this).attr('id');
});


function anuncios_error(jqXHR, textStatus, errorThrown){
//    if (errorThrown) {
//        alert(errorThrown);
//    }
//    else {
//        alert(textStatus);
//    }
    // Refresh the list.
    $("#drupalgap_page_anuncios_list").listview("destroy").listview();
}

function anuncios_success(content){
    // If there is any content, add each to the list, otherwise show an
    // empty message.
    if ($(content.data).length > 0) {
        $.each(content.data,function(index,obj){
            //html = "<a href='anuncio_detalles.html' id='" + obj.id + "'>" + obj.nombre + "</a>";
            anuncios.push(obj);
        });
        $("#drupalgap_page_anuncios_list").html("");
        $.each(anuncios,function(index,val){
            
            var img_path = val.NImagenAnuncio[0] ?  drupalgap_settings.site_path + "/sites/default/files/images/thumbs/"+val.NImagenAnuncio[0].nombre : "#";
            var string_descripcion = val.descripcion.length > val.descripcion.substring(0,50).length ? val.descripcion.substring(0,50) + "..." : val.descripcion;
            
            var destacado_style = '';
            if(val.destacadoTipo == "1")
                destacado_style = 'style = "background-color: #FCEDA7;"';
    
            var string_html = 
            "<li>"+
            "<a "+destacado_style+" href='anuncio_detalles.html' id='" + val.id + "'>";
            if(img_path != "#")
                string_html += "<img src='"+img_path+"' />";
                
            string_html += 
            "<h3>"+val.titulo+"</h3>" +
            "<p>"+string_descripcion+"</p>"+ 
            "</a>"+
            "</li>";
            $("#drupalgap_page_anuncios_list").append($(string_html)); 
        });
        
        if(anuncios.length < content.total){
            //Show more button
            $('#anuncios-ver-mas').show();
        }
    }
    else {
        html = "Lo sentimos, no hay contenido para mostrar.";
        $("#drupalgap_page_anuncios_list").append($("<li></li>",{
            "html":html
        }));
    }
    
    
    // Refresh the list.
    $("#drupalgap_page_anuncios_list").listview("destroy").listview();
    

    if(scroll){
        $('html, body').animate({
            scrollTop: $("#drupalgap_page_anuncios_list li:last-child").offset().top
        }, 2000);
        scroll = false;
    }
       
}


function load_anuncios_list(){
    
   
    views_options_a = {
        "endpoint" : "mclasificados",
        "save_to_local_storage" : "0",
        "path" : "view",
        "data" : "start="+anun_start+"&limit="+max_items_a,
        "success" : anuncios_success,
        "error" : anuncios_error,
    };
 
            
    anuncios_retrieve.resource_call(views_options_a);                
    
}

function load_anuncios_provincias_list(){
    
   
    views_options_a = {
        "endpoint" : "mclasificados_provincia",
        "save_to_local_storage" : "0",
        "path" : "view",
        "data" : "id_provincia="+drupalgap_page_provincia_pid+"&start="+anun_start+"&limit="+max_items_a,
        "success" : anuncios_success,
        "error" : anuncios_error,
    };
 
            
    anuncios_retrieve.resource_call(views_options_a);                
    
}

function load_anuncios_categorias_list(){
    
   
    views_options_a = {
        "endpoint" : "mclasificados_categoria",
        "save_to_local_storage" : "0",
        "path" : "view",
        "data" : "id_categoria="+drupalgap_page_categoria_cid+"&start="+anun_start+"&limit="+max_items_a,
        "success" : anuncios_success,
        "error" : anuncios_error,
    };
 
            
    anuncios_retrieve.resource_call(views_options_a);                
    
}




