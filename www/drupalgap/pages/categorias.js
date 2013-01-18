var scroll = false;

$('#categorias-ver-mas').live('click',function(){
    $('#categorias-ver-mas').hide();
    
    cat_start = cat_start + max_items;
    
    scroll = true;
    
    load_categorias_list();
    
            
    
            
    $('html, body').animate({
        scrollTop: $("#drupalgap_page_categorias_list li:last-child").offset().top
    }, 2000);
});
        
$('#drupalgap_page_categorias').live('pageshow',function(){
    try {
        max_items = 10;
        
        cat_start = 0;
        
        categorias = [];
        
        drupalgap_page_provincia_pid = -1;
        
      
        load_categorias_list();
      
    }
    catch (error) {
        console.log("drupalgap_page_categorias");
        console.log(error);
    }
});

// When a content list item is clicked...
$('#drupalgap_page_categorias_list a').live("click",function(){
    // Save a reference to the node id.
    drupalgap_page_categoria_cid = $(this).attr('id');
    
});


function categorias_error(jqXHR, textStatus, errorThrown){
    if (errorThrown) {
        alert(errorThrown);
    }
    else {
        alert(textStatus);
    }
    // Refresh the list.
    $("#drupalgap_page_categorias_list").listview("destroy").listview();
}

function categorias_success(content){
    // If there is any content, add each to the list, otherwise show an
    // empty message.
    if ($(content.data).length > 0) {
        $.each(content.data,function(index,obj){
            
            categorias.push(obj);
        });
       
        $("#drupalgap_page_categorias_list").html("");
        $.each(categorias,function(index,val){            
            $("#drupalgap_page_categorias_list").append($("<li><a href='anuncios.html' id='" + val.id + "'>" + val.nombre + "</a></li>")); 
            
        });
        
        if($(categorias).length < content.total){
            //Show more button
            $('#categorias-ver-mas').show();
        }
    }
    else {
        html = "Lo sentimos, no hay contenido para mostrar.";
        $("#drupalgap_page_categorias_list").append($("<li></li>",{
            "html":html
        }));
    }
    
    
    // Refresh the list.
    $("#drupalgap_page_categorias_list").listview("destroy").listview();
    
    if(scroll){
        $('html, body').animate({
            scrollTop: $("#drupalgap_page_categorias_list li:last-child").offset().top
        }, 2000);
        scroll = false;
    }

}



function load_categorias_list(){
    // $("#drupalgap_page_categorias_list").html("");
    $("#drupalgap_page_categorias_list").show();
     
    views_options_c = {
        "endpoint" : "mclasificados",
        "path" : "categorias/view",
        "data" : "id_seccion="+drupalgap_page_categoria_cid+"&start="+cat_start+"&limit="+max_items,
        "success" : categorias_success,
        "error" : categorias_error
    };
        
    
            
    anuncios_retrieve.resource_call(views_options_c);                
    
}


