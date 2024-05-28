let changeAccountDialog = $("#modal-change-account")

function changeAccount() {
    changeAccountDialog.modal("show")

    
}

$("#btnOkChangeAccount").click(() => {
    const firstName = document.getElementById("input-first-name-change")
    const secondName = document.getElementById("input-second-name-change")

    const dataToSend = JSON.stringify({
        name: firstName.value + " " + secondName.value
    })


    fetch("/api/active-account")
        .then(response => response.json())
        .then(async data => {
            console.log("ACTIVE:", data)
            await fetch("/api/update-status/offline", {
                "method": "POST",
                "headers" :  {
                    "Content-Type" : "application/json; charset=utf-8"
                },
                "body" : JSON.stringify(data)
            })
            .then(response => response.json())
            .then(data => {
                console.log(data)  
            })  
        })

    fetch("/api/student", {
        "method": "POST",
        "headers" :  {
            "Content-Type" : "application/json; charset=utf-8"
        },
        "body" : dataToSend
    })
    .then(response => response.json())
    .then(data => {
        if(data.status === "error") {
            console.log(data.error);
        } else {
            console.log(data)
            window.location.href = '/';                
        }
    })



    // console.log(name)
})

$('.close-dialog').click(function () {
    changeAccountDialog.modal('hide');
    return;
});