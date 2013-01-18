$('#drupalgap_page_dashboard').live('pagebeforeshow',function(){
    try {
        if(!drupalgap_connection_success)
            $.mobile.changePage("welcome.html");
        drupalgap_page_provincia_pid = -1;
        drupalgap_page_categoria_cid = -1;
       
       
        // Display site name.
        site_name = drupalgap_site_settings.variable.site_name;
        if (!site_name) {
            site_name = "DrupalGap";
        }
        $('#drupalgap_page_dashboard h2').html("Merkanuncio");
		
        // Hide both navbars (logic below will show them).
        $('#drupalgap_page_dashboard_navbar_anonymous').hide();
        $('#drupalgap_page_dashboard_navbar_authenticated').hide();
        
        $('#drupalgap_button_user_login').hide();
        $('#drupalgap_button_user_logout').hide();
        $('#drupalgap_button_user_register').hide();
		
        if (drupalgap_user.uid == 0) { // user is not logged in...
            $('#drupalgap_page_dashboard_navbar_anonymous').show();
            //$('#drupalgap_page_dashboard_header_user h2').hide();
            
            $('#drupalgap_button_user_login').show();
            $('#drupalgap_button_user_register').show();
            
            // determine what to do with the user registration button based on the site settings
            switch (drupalgap_site_settings.variable.user_register) {
                case 0: // Administrators only
                case "0":
                    $('#drupalgap_button_user_register').hide();
                    break;
                case 1: // Visitors
                case "1":
                    break;
                case 2: // Visitors, but administrator approval is required
                case "2":
                    break;
            }
        }
        else { // user is logged in...
            $('#drupalgap_page_dashboard_navbar_authenticated').show();
            $('#drupalgap_page_dashboard_header_user h2').html("Hola, " + drupalgap_user.name);
            
            $('#drupalgap_button_user_logout').show();
        }
		
        // Load user access permissions.
        access_content = drupalgap_services_user_access({
            "permission":"access content"
        });
        
        destacados_portada();
		
        // Set visibility on other buttons.
        if (access_content) {
            load_ultimos_anuncios_list();
            load_mas_vistos_list();
        }
        
		
    }
    catch (error) {
        console.log("drupalgap_page_dashboard");
        console.log(error);
    }
});

$('#drupalgap_button_user_logout').live("click",function(){
    try {
        // Build the service call options.
        options = {
            "error":function (jqXHR, textStatus, errorThrown) {
//                if (errorThrown) {
//                    alert(errorThrown);
//                }
//                else {
//                    alert(textStatus);
//                }
            },
            "success":function(){
                // TODO - changing to the dashboard here has strange behavior,
                // it would be best to go to the dashboard instead.
                $.mobile.changePage("user_login.html", "slideup");
            //$.mobile.changePage("dashboard.html",{reloadPage:true},{allowSamePageTranstion:true},{transition:'none'});
            },
        };
        // Make the service call.
        drupalgap_services_drupalgap_user_logout.resource_call(options);
    }
    catch (error) {
        console.log("drupalgap_button_user_logout - " + error);	
    }
    return false;
});

$('#drupalgap_page_ultimos_anuncios_list a').live("click",function(){
    // Save a reference to the node id.
    drupalgap_page_anuncio_detalles_aid = $(this).attr('id');
});

$('#drupalgap_page_mas_vistos_list a').live("click",function(){
    // Save a reference to the node id.
    drupalgap_page_anuncio_detalles_aid = $(this).attr('id');
});

$('.btnBack').live("click",function(){
    history.back();
});

function load_ultimos_anuncios_list(){
    
   
    views_options_a = {
        "endpoint" : "mclasificados",
        "save_to_local_storage" : "0",
        "path" : "view",
        "data" : "start=0&limit=5",
        "success" : ultimos_anuncios_success,
        "error" : ultimos_anuncios_error,
    };
 
            
    anuncios_retrieve.resource_call(views_options_a);                
    
}

function ultimos_anuncios_success(content){
    // If there is any content, add each to the list, otherwise show an
    // empty message.
    if ($(content.data).length > 0) {
        
        $("#drupalgap_page_ultimos_anuncios_list").html("");
        $.each(content.data,function(index,val){
            
            var string_html = 
            "<li>"+
            "<a href='anuncio_detalles.html' id='" + val.id + "'>"+
            val.titulo+
            
            "</a>"+
            "</li>";
            $("#drupalgap_page_ultimos_anuncios_list").append($(string_html)); 
        });
        
    }
    else {
        html = "Lo sentimos, no hay contenido para mostrar.";
        $("#drupalgap_page_ultimos_anuncios_list").append($("<li></li>",{
            "html":html
        }));
    }
    
    
    // Refresh the list.
    $("#drupalgap_page_ultimos_anuncios_list").listview("destroy").listview();
    
}

function ultimos_anuncios_error(jqXHR, textStatus, errorThrown){
//    if (errorThrown) {
//        alert(errorThrown);
//    }
//    else {
//        alert(textStatus);
//    }
    // Refresh the list.
    $("#drupalgap_page_ultimos_anuncios_list").listview("destroy").listview();
}

function load_mas_vistos_list(){
    
   
    views_options_a = {
        "endpoint" : "mclasificados",
        "save_to_local_storage" : "0",
        "path" : "masvistos",
        "data" : "start=0&limit=5",
        "success" : mas_vistos_success,
        "error" : mas_vistos_error,
    };
 
            
    anuncios_retrieve.resource_call(views_options_a);                
    
}

function mas_vistos_success(content){
    // If there is any content, add each to the list, otherwise show an
    // empty message.
    if ($(content.data).length > 0) {
        
        $("#drupalgap_page_mas_vistos_list").html("");
        $.each(content.data,function(index,val){
            
            var string_html = 
            "<li>"+
            "<a href='anuncio_detalles.html' id='" + val.id + "'>"+
            val.titulo+
            
            "</a>"+
            "</li>";
            $("#drupalgap_page_mas_vistos_list").append($(string_html)); 
        });
        
    }
    else {
        html = "Lo sentimos, no hay contenido para mostrar.";
        $("#drupalgap_page_mas_vistos_list").append($("<li></li>",{
            "html":html
        }));
    }
    
    
    // Refresh the list.
    $("#drupalgap_page_mas_vistos_list").listview("destroy").listview();
    
}

function mas_vistos_error(jqXHR, textStatus, errorThrown){
//    if (errorThrown) {
//        alert(errorThrown);
//    }
//    else {
//        alert(textStatus);
//    }
    // Refresh the list.
    $("#drupalgap_page_mas_vistos_list").listview("destroy").listview();
}


function destacados_portada_success(content){
    
    var leters = ['a','b','c'];
    
    if ($(content.data).length > 0) {
        $("#destacados_portada").html("");
    
        
    
        $.each(content.data,function(index,val){
            var img_path = val.NImagenAnuncio[0] ?  drupalgap_settings.site_path + "/sites/default/files/images/thumbs/"+val.NImagenAnuncio[0].nombre : drupalgap_settings.site_path + "/sites/default/files/images/nophoto.png";
            
            var string_html = '<div class="ui-block-'+leters[index]+'">'+
            '<div class="ui-bar ui-bar-e" style="height:75px;margin: 5px;">'+
            '<div style="float: left;width:41%; height:60px;"><img src="'+img_path+'" style="width:100%;height:100%;"/></div>'+
            '<div style="float: left;width: 56%;font-size: 14px;">'+val.titulo+'</div>'+
            '</div>'+            
            '</div>';
    
            $("#destacados_portada").append(string_html);
        });
    }
    
    if ($(content.data).length < 3) {
        for(var i = $(content.data).length; i < 3;i++){
            var string_html = '<div class="ui-block-'+leters[i]+'">'+
            '<div class="ui-bar ui-bar-e" style="height:75px;margin: 5px;padding:0.4em 3px;">'+
            '<div style="float: left;width:41%; height:60px;margin-right:3px;"><img src="'+drupalgap_settings.site_path + "/sites/default/files/images/nophoto.png"+'" style="width:90%;height:90%;"/></div>'+
            '<div style="float: left;width: 56%;font-size: 14px;">Destaque sus anuncios en portada</div>'+
            '</div>'+
            '</div>';
    
            $("#destacados_portada").append(string_html);
        }
    }
}
function destacados_portada_error(jqXHR, textStatus, errorThrown){
    //    if (errorThrown) {
    //        alert(errorThrown);
    //    }
    //    else {
    //        alert(textStatus);
    //    }
    console.log('error : '+textStatus);

}

function destacados_portada(){
    
    views_options_a = {
        "endpoint" : "mclasificados",
        "save_to_local_storage" : "0",
        "path" : "destacadosportada",
        "data" : "start=0&limit=3",
        "success" : destacados_portada_success,
        "error" : destacados_portada_error,
    };
 
            
    anuncios_retrieve.resource_call(views_options_a);    
    
    
}
