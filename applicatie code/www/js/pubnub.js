
$(function(){
    document.addEventListener("deviceready", onDeviceReady, false);
    $('.sidenav').sidenav();
    $('.sidenav a').click(function () {
        $('.spa').hide();
        $("#teksttitle2").html($(this).data('title')).show();
        $('#' + $(this).data('show')).show();
        var naam = $(this).data("show");
        if (naam == "tabInstelligen"){
            $('.sidenav-trigger').hide();
        }
        $('.sidenav').sidenav('close');
    });


    if (location.hash = "#login") {
        $('.sidenav-trigger').hide();
    }

});
