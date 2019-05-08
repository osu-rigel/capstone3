$('#plotlyLoad').on('click', () => {
    console.log($('#plotlyOptions option:selected').val());
    $.ajax({
        url : '/plotlyTest/load/' + $('#plotlyOptions option:selected').val(),
        type: 'GET',
        success: (body, textStatus, jqXHR) => {
            console.log(body);
            Plotly.newPlot(document.getElementById('tester'), JSON.parse(body), {
                "xaxis" : { 
                    "title" : $('#plotlyOptions option:selected').val()
                },
                "yaxis" : {
                    "title" : "Awards"
                }
            });
        },
        error: (jqXHR, textStatus, errorThrown) => {
            console.error(errorThrown);
        }
    })
})