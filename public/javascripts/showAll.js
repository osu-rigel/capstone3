$('#button').on('click', () => {
    $.ajax({
        url: "/awards/search/awardee_name/Ken",
        type: 'GET',
        success: (result) => {
            console.log(result);
        },
        error: (jqXHR, textStatus, errorThrown) => {
            console.error(errorThrown);
        }
    })
})