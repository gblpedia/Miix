(function($){

    // Widget definition
    $.widget("mobile.ourWidgetName", $.mobile.widget, {
    
        options:{
        // Here we can create defualt options fo our widget
        },
        // Private methods
        _create: function(){
            // The constructor function
        },
        
        // Public methods
        enable: function(){
        
        },
        disable: function(){
        
        },
        refresh: function(){
        
        }
    }); // End of widget definition
    
    //  Auto-initialization code
    $(document).bind("pagecreate", function(event){
        // We find data-role's and apply our widget constructor
        $(event.target).find(":jqmData(role='ourWidgetName')").ourWidgetName();
    });
    
}(jQuery));