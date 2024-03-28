$(document).ready(function() {
    $('#loader').hide();

    $('#searchForm').submit(function() {
        $('#loader').show();
    });

    $(document).ajaxStop(function() {
        $('#loader').hide();
    });
});
