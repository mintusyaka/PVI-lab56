import { onUsernameSelection } from "./socket.js"

window.addEventListener("load", async () => {
    fetch("/api/students")
    .then(response => response.json())
    .then(data =>  {
        addStudentsToTable(data)
    })
})

async function addStudentsToTable(students) {
    let activeUser;

    await fetch("/api/active-account")
    .then(response => response.json())
    .then(async data => {
        if(data.status === "error") {
            activeUser = undefined
        } else {
            activeUser = data

            const dataToSend = JSON.stringify(activeUser)

            await fetch("/api/update-status/online", {
                "method" : "POST",
                "headers" : {
                    "Content-Type" : "application/json; charset=utf-8"
                },
                "body" : dataToSend      
            })
            .then(response => response.json())
            .then(data => {
              console.log(data)  
            })
        }
    })

    let _row_2 = $('#table-students');
    students.forEach(student => {
        let _checkbox = $('<td></td>').html('<input type="checkbox" name="checkbox" aria-label="checkbox" />');

        let _name = $('<td class="name"></td>').text(student.name);

        let _group = $('<td class="group"></td>').text(student.group_name);

        let _gender = $('<td class="gender"></td>').text(student.sex);

        let _status = $('<td></td>').html('&bull;');
        if(checkIsOnline(student, activeUser)) {
            _status.attr('class', 'status-bull active');
        } else {
            _status.attr('class', 'status-bull');
        }   

        let _button_edit = $('<button></button>');
        _button_edit.attr('type', 'button');
        _button_edit.attr('onclick', 'editStudent(this)');
        _button_edit.attr('class', 'btnEdit');
        _button_edit.html('&#9998;');

        let _button_delete = $('<button></button>');
        _button_delete.attr('type', 'button');
        _button_delete.attr('onclick', 'deleteStudent(this)');
        _button_delete.attr('class', 'btnDelete');
        _button_delete.html('<span>&times;</span>');


        let _div = $('<div></div>');
        _div.append(_button_edit);
        _button_edit.after(_button_delete);
        let _buttons = $('<td></td>').html(_div);

        let _birthday = $('<td class="birthday"></td>').text(student.birthday);

        _row_2.append($('<tr></tr>').html(_checkbox));
        _checkbox.after(_group);
        _group.after(_name);
        _name.after(_gender);
        _gender.after(_birthday);
        _birthday.after(_status);
        _status.after(_buttons);
    });

    const curUser = document.getElementById("active-user-name")
    curUser.innerHTML = activeUser.name

    onUsernameSelection(activeUser.name)
}

function checkIsOnline(user, active) {
    if(user.status === 'online') {
        return true;
    }
    else if(typeof(user) === typeof(active)) {
        return user.name === active.name
    }
    else return false;
}

$("#btnLogOut").click( () => {
    console.log("LOG OUT")
    fetch("/api/active-account")
    .then(response => response.json())
    .then(data => {
        fetch("/api/update-status/offline", {
            "method": "POST",
                "headers" :  {
                    "Content-Type" : "application/json; charset=utf-8"
                },
                "body" : JSON.stringify(data)
        })
        fetch("/api/logout")
    })
})

$(".dropdown").click( () => {
    $('.dropdown').attr("class", "dropdown")
})