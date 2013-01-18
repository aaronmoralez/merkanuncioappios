var scroll = false;


$('#misanuncios-ver-mas').live('click',function(){
    
    $('#misanuncios-ver-mas').hide();
            
    mis_start = mis_start + max_items;
    
    scroll = true;
    
  
    mis_anuncios_list();
            
            
            
    
});

$('#drupalgap_page_user').live('pageshow',function(){
    try {
        max_items = 10;
        
        mis_start = 0;
        mis_anuncios = [];
        
        if (drupalgap_user.uid == 0) { 
            $.mobile.changePage("dashboard.html", "slideup");
            return false;
        }
		
        // populate user account template place holders
		
        // user name
        $('#drupalgap_page_user h1').html(drupalgap_user.name);
		
        // user created date (Drupal's time value(s) must be multiplied by 1000 since JavaScript deals in milliseconds for the Unix Epoch????)
        created = new Date(parseInt(drupalgap_user.created)*1000);
        $('#drupalgap_page_user_created').html(created.toDateString());
		
    }
    catch (error) {
        console.log("drupalgap_page_user - " + error);
        alert("drupalgap_page_user - " + error);
    }
});

$('#drupalgap_button_mis_anuncios').live('click',function(){
    $(this).hide();
    
    mis_anuncios_list();
});

$('#drupalgap_page_mis_anuncios_list a').live("click",function(){
    // Save a reference to the node id.
    drupalgap_page_anuncio_detalles_aid = $(this).attr('id');
});

function mis_anuncios_list(){
    
   
    views_options_a = {
        "endpoint" : "mclasificados",
        "save_to_local_storage" : "0",
        "path" : "view",
        "data" : "start="+mis_start+"&limit="+max_items,
        "success" : mis_anuncios_success,
        "error" : mis_anuncios_error,
    };
 
            
    anuncios_retrieve.resource_call(views_options_a);                
    
}

function mis_anuncios_success(content){
    // If there is any content, add each to the list, otherwise show an
    // empty message.
    if(!scroll)
        mis_anuncios = [];
    
    if ($(content.data).length > 0) {
        $.each(content.data,function(index,obj){
            //html = "<a href='anuncio_detalles.html' id='" + obj.id + "'>" + obj.nombre + "</a>";
            mis_anuncios.push(obj);
        });
        
        $("#drupalgap_page_mis_anuncios_list").html("");
        $.each(mis_anuncios,function(index,val){
            
            var string_html = 
            "<li>"+
            "<a href='anuncio_detalles.html' id='" + val.id + "'>"+
            val.titulo+
            
            "</a>"+
            "</li>";
            $("#drupalgap_page_mis_anuncios_list").append($(string_html)); 
        });
        
        if(mis_anuncios.length < content.total){
            //Show more button
            $('#misanuncios-ver-mas').show();
        }
        
    }
    else {
        html = "Lo sentimos, no hay contenido para mostrar.";
        $("#drupalgap_page_mis_anuncios_list").append($("<li></li>",{
            "html":html
        }));
    }
    
    
    // Refresh the list.
    $("#drupalgap_page_mis_anuncios_list").listview("destroy").listview();
    
    if(scroll){
        $('html, body').animate({
            scrollTop: $("#drupalgap_page_mis_anuncios_list li:last-child").offset().top
        }, 2000);
        scroll = false;
    }
    
}

function mis_anuncios_error(jqXHR, textStatus, errorThrown){
    if (errorThrown) {
        alert(errorThrown);
    }
    else {
        alert(textStatus);
    }
    // Refresh the list.
    $("#drupalgap_page_mis_anuncios_list").listview("destroy").listview();
}