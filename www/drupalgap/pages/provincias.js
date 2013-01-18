var scroll = false;

$('#provincias-ver-mas').live('click',function(){
    $('#provincias-ver-mas').hide();
    prov_start = prov_start + max_items;
    
    scroll = true;
    
    load_provincias_list(true);
            
            
});
        
$('#drupalgap_page_provincias').live('pageshow',function(){
    try {
        max_items = 10;
        
        prov_start = 0;
        provincias = [];
        
        drupalgap_page_categoria_cid = -1;
        
        
             
        load_provincias_list(false);
    }
    catch (error) {
        console.log("drupalgap_page_provincias");
        console.log(error);
    }
});

// When a content list item is clicked...
$('#drupalgap_page_provincias_list a').live("click",function(){
    // Save a reference to the node id.
    drupalgap_page_provincia_id = $(this).attr('id');
});


$('input[name=radio-view]').live("change",function(){
	
    var vista = $('input[name=radio-view]:checked').val();
        
    switch(vista){        
        case "provincias":
            $.mobile.changePage("provincias.html");
            break;
        
    }
        
});

$('#drupalgap_page_provincias_list a').live("click",function(){
    // Save a reference to the node id.
    drupalgap_page_provincia_pid = $(this).attr('id');
});


function provincias_error(jqXHR, textStatus, errorThrown){
    if (errorThrown) {
        alert(errorThrown);
    }
    else {
        alert(textStatus);
    }
    // Refresh the list.
    $("#drupalgap_page_provincias_list").listview("destroy").listview();
}

function provincias_success(content){
    // If there is any content, add each to the list, otherwise show an
    // empty message.
    if ($(content.data).length > 0) {
        $.each(content.data,function(index,obj){
            
            provincias.push(obj);
        });
        $("#drupalgap_page_provincias_list").html("");
        $.each(provincias,function(index,val){
            
            $("#drupalgap_page_provincias_list").append($("<li><a href='anuncios.html' id='" + val.id + "'>" + val.nombre + "</a></li>")); 
        });
        
        if(provincias.length < content.total){
            //Show more button
            $('#provincias-ver-mas').show();
        }
    }
    else {
        html = "Lo sentimos, no hay contenido para mostrar.";
        $("#drupalgap_page_provincias_list").append($("<li></li>",{
            "html":html
        }));
    }
    
    
    // Refresh the list.
    $("#drupalgap_page_provincias_list").listview("destroy").listview();
    
    if(scroll){
        $('html, body').animate({
            scrollTop: $("#drupalgap_page_provincias_list li:last-child").offset().top
        }, 2000);
        scroll = false;
    }
   

}


function load_provincias_list(append){
    // $("#drupalgap_page_provincias_list").html("");
    $("#drupalgap_page_provincias_list").show();
    
    views_options_p = {
        "endpoint" : "mclasificados",
        "path" : "provincias/view",
        "data" : "start="+prov_start+"&limit="+max_items,
        "success" : provincias_success,
        "error" : provincias_error
    };  
    
            
    anuncios_retrieve.resource_call(views_options_p);                
    
}


