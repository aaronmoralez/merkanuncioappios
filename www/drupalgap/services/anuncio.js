// global variables used to hold the latest system resource call results
var drupalgap_services_anuncio_update_result;
var drupalgap_services_anuncio_delete_result;

var drupalgap_services_anuncio_CRUD = {
	"resource_path":"",
	"resource_type":"post",
	"resource_call":function (caller_options) {
		try {
			// Build options for service call.
                        this.resource_path = caller_options.path;
                        
			options = {
                                "endpoint" : caller_options.endpoint,
                                "save_to_local_storage" : "0",
				"resource_path":this.resource_path,
                                "data" : caller_options.data,
				"type":this.resource_type,
				"async":true,
				"error":this.error,
				"success":this.success,
			};
			
			// Attach error/success hooks if provided.
			if (caller_options.error) {
				options.hook_error = caller_options.error;
			}
			if (caller_options.success) {
				options.hook_success = caller_options.success;
			}
			
			// Make the service call to the node create resource.
			drupalgap_services.resource_call(options);
		}
		catch (error) {
			console.log("drupalgap_services_node_create");
			console.log(error);
		}
	},
	"error":function (jqXHR, textStatus, errorThrown) {
//		if (errorThrown) {
//			alert(errorThrown);
//		}
//		else {
//			alert(textStatus);
//		}
	},
	
	"success":function (data) {
	},
}; 
