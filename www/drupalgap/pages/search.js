/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

var select_changed = false;
$('#anuncios-search-ver-mas').live('click',function(){
    
    $('#anuncios-search-ver-mas').hide();
            
    search_start = search_start + max_items;
    
    scroll = true;
         
            
    buscar_anuncios();
            
            
            
    
});

$('#drupalgap_page_search').live('pageshow',function(){
    if(select_changed)
    {
        select_changed = false;   
        return;
    }
    max_items = 10;
    search_start = 0;
    anuncios_search = [];
        
    load_secciones_search_select();
    load_provincias_search_select();
    
});


$('#btnSearchFormAceptar').live('click',function(){
    //enviar_contacto();
    });

$('#drupalgap_page_search_form select').live('change',function(){
    
    select_changed = true;
});

$('#seccion_search').live('change',function(){
    var seccion = $("#seccion_search").val();
    
    load_categorias_search_select(seccion);
});

$('#drupalgap_page_anuncios_search_list a').live("click",function(){
    // Save a reference to the node id.
    drupalgap_page_anuncio_detalles_aid = $(this).attr('id');
});

$('#btnSearchFormAceptar').live('click',function(){
    buscar_anuncios();
});

function buscar_anuncios(){
    
    var texto = $("#contiene").val();
    var seccion = $("#seccion_search").val();
    var categoria = $("#categoria_search").val();
    var provincia = $("#provincia_search").val();
    
    views_options_c = {
        "endpoint" : "mclasificados",
        "path" : "search",
        "data" : "start="+search_start+"&limit="+max_items+"&texto="+texto+"&seccion="+seccion+"&categoria="+categoria+"&provincia="+provincia,
        "success" : buscar_anuncios_success,
        "error" : buscar_anuncios_error
    };
         
    anuncios_retrieve.resource_call(views_options_c); 
}


function buscar_anuncios_error(jqXHR, textStatus, errorThrown){
    //console.log("drupalgap_page_user_edit");
    console.log(error);
}

function buscar_anuncios_success(content){
    // If there is any content, add each to the list, otherwise show an
    // empty message
    $("#drupalgap_page_anuncios_search_list").html("");
    $('#anuncios-search-ver-mas').hide();
    
    if(!scroll)
        anuncios_search = [];
    
    if ($(content.data).length > 0) {
        $.each(content.data,function(index,obj){
            //html = "<a href='anuncio_detalles.html' id='" + obj.id + "'>" + obj.nombre + "</a>";
            anuncios_search.push(obj);
        });
        
        $.each(anuncios_search,function(index,val){
            
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
            $("#drupalgap_page_anuncios_search_list").append($(string_html)); 
        });
        
        if(anuncios_search.length < content.total){
            
            //Show more button
            $('#anuncios-search-ver-mas').show();
        }
    }
    else {
        html = "Lo sentimos, no hay contenido para mostrar.";
        $("#drupalgap_page_anuncios_search_list").append($("<li></li>",{
            "html":html
        }));
    }
    
    
    // Refresh the list.
    $("#drupalgap_page_anuncios_search_list").listview("destroy").listview();
    

    if(scroll){
        $('html, body').animate({
            scrollTop: $("#drupalgap_page_anuncios_search_list li:last-child").offset().top
        }, 2000);
        scroll = false;
    }

}

function load_secciones_search_select(){
    
    
    views_options_c = {
        "endpoint" : "mclasificados",
        "path" : "secciones/view",
        //"data" : "start="+cat_start+"&limit="+max_items,
        "success" : secciones_search_success,
        "error" : secciones_search_error
    };
         
    anuncios_retrieve.resource_call(views_options_c);                
    
}

function secciones_search_error(jqXHR, textStatus, errorThrown){
    //console.log("drupalgap_page_user_edit");
    console.log(error);
}

function secciones_search_success(content){
    $("#seccion_search").html("");
    if ($(content.data).length > 0) {
        $("#seccion_search").append("<option value=-1>Seleccione...</option>"); 
        $.each(content.data,function(index,value){                          
            $("#seccion_search").append("<option value='"+value.id+"'>"+value.nombre+"</option>");                            
                            
        });
        
    }
    else {
        html = "Lo sentimos, no hay contenido para mostrar.";
        $("#seccion_search").append($("<option></option>",{
            "html":html
        }));
    }
        
    // Refresh the list.
    $("#seccion_search").selectmenu('refresh',true);  
    
    secc_loaded = true;
    if((prov_loaded == true) && (secc_loaded == true))
        search_form_activate_buttons();

}

function load_categorias_search_select(seccion_id){
         
    views_options_c = {
        "endpoint" : "mclasificados",
        "path" : "categorias/view",
        "data" : "id_seccion="+seccion_id,
        "success" : categorias_search_success,
        "error" : categorias_search_error
    };
        
    
            
    anuncios_retrieve.resource_call(views_options_c);                
    
}

function categorias_search_error(jqXHR, textStatus, errorThrown){
    //console.log("drupalgap_page_user_edit");
    console.log(error);
}

function categorias_search_success(content){
    $("#categoria_search").html("");
    if ($(content.data).length > 0) {
        $("#categoria_search").append("<option value=-1>Seleccione...</option>"); 
        $.each(content.data,function(index,value){
                          
            $("#categoria_search").append("<option value='"+value.id+"'>"+value.nombre+"</option>");                            
                            
        });
                        
    }
    else {
        html = "Lo sentimos, no hay contenido para mostrar.";
        $("#categoria_search").append($("<option></option>",{
            "html":html
        }));
    }
          
        
    // Refresh the list.
    $("#categoria_search").selectmenu('refresh',true);    
    
    
}


function load_provincias_search_select(){
         
    views_options_c = {
        "endpoint" : "mclasificados",
        "path" : "provincias/view",       
        "success" : provincias_search_success,
        "error" : provincias_search_error
    };
        
    anuncios_retrieve.resource_call(views_options_c);                
    
}

function provincias_search_error(jqXHR, textStatus, errorThrown){
    //console.log("drupalgap_page_user_edit");
    console.log(error);
}

function provincias_search_success(content){
    
    
    if ($(content.data).length > 0) {
        $("#provincia_search").append("<option value=-1>Seleccione...</option>");
        $.each(content.data,function(index,value){
                          
            $("#provincia_search").append("<option value='"+value.id+"'>"+value.nombre+"</option>");                            
                            
        });
                        
    }
    else {
        html = "Lo sentimos, no hay contenido para mostrar.";
        $("#provincia_search").append($("<option></option>",{
            "html":html
        }));
    }
        
    // Refresh the list.
    $("#provincia_search").selectmenu('refresh',true);    
    
    prov_loaded = true;
    if((prov_loaded == true) && (secc_loaded == true))
        search_form_activate_buttons();
    
   
    
}

function search_form_activate_buttons(){
    
    $('#search_form_action_buttons').show();
}