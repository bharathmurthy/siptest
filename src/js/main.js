$(document).ready(function(e){
    $(".key").on("click",function(){
        var $theValue=$(this).attr("rel");
        alert($theValue);
    });
});
