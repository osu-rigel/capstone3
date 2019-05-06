$.ajax({
    url : '/plotlyTest/awardsReceived',
    type : 'GET',
    success : (body, textStatus, jqXHR) => {
        console.log(body);
        Plotly.plot(document.getElementById('tester'), JSON.parse(body), {
            "xaxis" : { 
                "title" : "Recipient",
            },
            "yaxis" : {
                "title" : "Awards"
            },
            "title" : "Awards Received"
        });
    },
    error : (jqXHR, textStatus, errorThrown) => {
        console.error(errorThrown);
    }
})