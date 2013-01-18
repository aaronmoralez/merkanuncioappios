var scroll = false;

$('#secciones-ver-mas').live('click',function(){
    $('#secciones-ver-mas').hide();
    
    cat_start = cat_start + max_items;
    scroll = true;
    
    load_secciones_list();
            
    
            
    $('html, body').animate({
        scrollTop: $("#drupalgap_page_secciones_list li:last-child").offset().top
    }, 2000);
});
        
$('#drupalgap_page_secciones').live('pageshow',function(){
    try {
        max_items = 10;
        
        cat_start = 0;
        
        secciones = [];
        
        drupalgap_page_provincia_pid = -1;
        drupalgap_page_categoria_cid = -1;
        
        load_secciones_list();
    }
    catch (error) {
        console.log("drupalgap_page_secciones");
        console.log(error);
    }
});

// When a content list item is clicked...
$('#drupalgap_page_secciones_list a').live("click",function(){
    // Save a reference to the node id.
    drupalgap_page_categoria_cid = $(this).attr('id');
    
});


$('input[name=radio-view]').live("change",function(){
	
    var vista = $('input[name=radio-view]:checked').val();
        
    switch(vista){        
        case "categorias":
            $.mobile.changePage("secciones.html");
            break;
        
    }
        
});


function secciones_error(jqXHR, textStatus, errorThrown){
    if (errorThrown) {
        alert(errorThrown);
    }
    else {
        alert(textStatus);
    }
    // Refresh the list.
    $("#drupalgap_page_secciones_list").listview("destroy").listview();
}

function secciones_success(content){
    // If there is any content, add each to the list, otherwise show an
    // empty message.
    if ($(content.data).length > 0) {
        $.each(content.data,function(index,obj){
            
            secciones.push(obj);
        });
       
        $("#drupalgap_page_secciones_list").html("");
        $.each(secciones,function(index,val){                     
            $("#drupalgap_page_secciones_list").append($("<li><a href='categorias.html' id='" + val.id + "'>" + val.nombre + "</a></li>")); 
        });
        
        if($(secciones).length < content.total){
            //Show more button
            $('#secciones-ver-mas').show();
        }
    }
    else {
        html = "Lo sentimos, no hay contenido para mostrar.";
        $("#drupalgap_page_secciones_list").append($("<li></li>",{
            "html":html
        }));
    }
    
    
    // Refresh the list.
    $("#drupalgap_page_secciones_list").listview("destroy").listview();
    
    if(scroll){
        $('html, body').animate({
            scrollTop: $("#drupalgap_page_secciones_list li:last-child").offset().top
        }, 2000);
        scroll = false;
    }
}


function load_secciones_list(){
    // $("#drupalgap_page_categorias_list").html("");
    $("#drupalgap_page_secciones_list").show();
     
    views_options_c = {
        "endpoint" : "mclasificados",
        "path" : "secciones/view",
        "data" : "start="+cat_start+"&limit="+max_items,
        "success" : secciones_success,
        "error" : secciones_error
    };
        
    
            
    anuncios_retrieve.resource_call(views_options_c);                
    
}



