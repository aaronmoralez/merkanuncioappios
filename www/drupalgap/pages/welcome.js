$('#drupalgap_page_welcome').live('pageshow',function(){
    try {
        var page = $(this);
        // App has a default site path.
		
        // Make a call to the DrupalGap bundled system connect resource.
        // TODO - do something if the system connect fails.
        // TODO - if app is online, we should probably force a reload on this,
        // otherwise fall back to the local storage session.
        options = {
            "load_from_local_storage":"0",
            "error":function(jqXHR, textStatus, errorThrown){
                drupalgap_connection_success = false;
                if(page.data("url").indexOf('welcome.html', 0) == -1)
                    $.mobile.changePage("drupalgap/pages/welcome.html", {
                        transition: "fade"
                    });
            //				if (errorThrown) {
            //					alert(errorThrown);
            //				}
            //				else {
            //					alert(textStatus);
            //				}
            },
            "success":function(){
                drupalgap_connection_success = true;
                // Go to the dashboard.
                $.mobile.changePage("drupalgap/pages/dashboard.html", {
                    transition: "fade"
                });
            }
        };
        drupalgap_services_resource_system_connect.resource_call(options);
    }
    catch (error) {
        console.log("drupalgap_page_welcome");
        console.log(error);
    }
});

