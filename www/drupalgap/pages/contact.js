/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */


$('#drupalgap_page_contact').live('pageshow',function(){
    if(drupalgap_user.uid != 0){
        $("#nombre").val(drupalgap_user.name);
        $("#correo").val(drupalgap_user.mail);
    }
});


$('#btnContactFormAceptar').live('click',function(){
    enviar_contacto();
});

function enviar_contacto(){
    var nombre = $("#nombre").val();
    var correo = $("#correo").val();
    
    var telefono = "";
    var web = "";
    
    var asunto = $("#asunto").val();
    var comentario = $("#comentario").val();
    
    
    
    views_options_p = {
        "endpoint" : "mclasificados",
        "path" : "contactos/create",
        "data" : "nombre="+nombre+"&correo="+correo+"&telefono="+telefono+"&web="+web+"&asunto="+asunto+"&comentario="+comentario,
        "success" : enviar_contacto_success,
        "error" : enviar_contacto_error
    };  
    
            
    anuncios_retrieve.resource_call(views_options_p); 
}

function enviar_contacto_success(content){
    if(content.success)
        alert("Gracias por contactarnos. En breve le responderemos.");
    
    $.mobile.changePage("dashboard.html");
}

function enviar_contacto_error(){}
