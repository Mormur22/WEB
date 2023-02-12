
    $( document ).ready(function() {
        const dataContainer = $("#respuesta");
        $("input").focusout(function() {
            const valor=$("input").val();
            dataContainer.empty();
            dataContainer.html(valor);
        })
    });
