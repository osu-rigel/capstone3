$('#button').on('click', () => {
    $.ajax({
        url: "/awards/search/awardee_name/Ken",
        type: 'GET',
        success: (result) => {
            console.log(result);
        },
        error: (jqXHR, textStatus, errorThrown) => {
            console.error(errorThrown)
        }
    })
})

/*$('#button').on('click', () => {
    $.ajax({
        url: "/awards/deleteAward",
        type: 'POST',
        data: {
            field: "id",
            value: 4
        },
        success: (result) => {
            console.log(result);
        },
        error: (jqXHR, textStatus, errorThrown) => {
            console.error(errorThrown);
        }
    })
})*/