

$('#drupalgap_page_anuncios_edit').live('pageshow',function(){
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
        
        if(drupalgap_page_anuncio_detalles_aid == -1){
            alert("El id del anuncio no es válido");
            return;
        }
        
        document.getElementById('imgAdd1').src = drupalgap_settings.site_path + '/sites/default/files/images/nophoto.png';
        
        obtener_anuncio_update(drupalgap_page_anuncio_detalles_aid);
            
        
//        anuncio_id = -1;
//        var query = $(this).data("url").split("?")[1];
//        if(query){
//            if(query.indexOf('update') != -1){
//                anuncio_id = query.replace("update=","");
//                
//                obtener_anuncio_update(anuncio_id);
//            }
//        }else{
//            load_secciones_select();    
//            load_provincias_select();
//        }
            
        
    }
    catch (error) {
        console.log("drupalgap_page_content_edit - " + error);
    }
    
});

