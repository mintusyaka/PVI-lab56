$('.invalid-msg').parent().parent().hide();

/* вікно додавання та редагування */
let addEditStudentDialog = $('#modal-add-edit-student');

let _row;

$('.close-dialog').click(function () {
    addEditStudentDialog.modal('hide');
});

function addStudent(btn) {
    _row = $('#table-students');
    addEditStudentDialog.modal('show');

    $('#modal-add-edit-student .dialog-name').text('Add Student');
    $('#btnOkAddEditStudent').text('ADD');

    $('#btnOkAddEditStudent').removeAttr('class');
    $('#btnOkAddEditStudent').attr('class', 'ok add-btn');
}

$('#btnOkAddEditStudent').click(function() {
    if($('#btnOkAddEditStudent').attr('class') == 'ok add-btn') {
        $('.invalid-msg').parent().parent().hide();
        
        let _checkbox = $('<td></td>').html('<input type="checkbox" name="checkbox" aria-label="checkbox" />');

        let _name = $('<td class="name"></td>').text($('#input-first-name').val() + ' ' + $('#input-second-name').val());
    
        let _group = $('<td class="group"></td>').text($('#input-group').find(':selected').text());

        let _gender = $('<td class="gender"></td>').text($('#input-gender').find(':selected').text());

        let _status = $('<td></td>').html('&bull;');
        _status.attr('class', 'status-bull active');

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

        const inputDate = $('#input-birthday').val();
        const selectedDate = new Date(inputDate);
        const formattedDate = dayjs(selectedDate).format('DD.MM.YYYY');

        if($('#input-first-name').val().length < 2 || $('#input-second-name').val().length < 2) {
            $('.enter-name-msg').parent().parent().show();
            return;
        }

        if(formattedDate == 'Invalid Date' || selectedDate.getFullYear() < 1924 || selectedDate.getFullYear() > 2020) {
            $('.enter-birthday-msg').parent().parent().show();
            return;
        }

        let _birthday = $('<td class="birthday"></td>').text(formattedDate);

        const dataToSend = JSON.stringify(
            {
                group: _group.text(),
                name: _name.text(),
                sex: _gender.text(),
                birthday: _birthday.text(),
                mode: "ADD"
            });

        fetch("handle-data.php", {
            "method" : "POST",
            "headers" : {
                "Content-Type" : "application/json; charset=utf-8"
            },
            "body" : dataToSend
        }).then(function(response) {
            return response.json();
        }).then(function(data) {
            console.log(data);
            if(data["type"]) {
                console.log("TRUE");
                _row.append($('<tr></tr>').html(_checkbox));
                _checkbox.after(_group);
                _group.after(_name);
                _name.after(_gender);
                _gender.after(_birthday);
                _birthday.after(_status);
                _status.after(_buttons);

                addEditStudentDialog.modal('hide');
            }
            else {
                console.log("FALSE");
                alert(data["msg"]);
            }
        })
        // console.log(dataToSend);        
        
    }
    else if($('#btnOkAddEditStudent').attr('class') == 'ok edit-btn') {
        $('.invalid-msg').parent().parent().hide();

        const inputDate = $('#input-birthday').val();
        const selectedDate = new Date(inputDate);
        const formattedDate = dayjs(selectedDate).format('DD.MM.YYYY');

        if($('#input-first-name').val().length < 3 || $('#input-second-name').val().length < 3) {
            $('.enter-name-msg').parent().parent().show();
            return;
        }

        if(formattedDate == 'Invalid Date' || selectedDate.getFullYear() < 1924 || selectedDate.getFullYear() > 2020) {
            $('.enter-birthday-msg').parent().parent().show();
            return;
        }
        
        let _name = _row.find('.name');
       
        const dataToSend = JSON.stringify(
            {
                group: $('#input-group').find(':selected').text(),
                name: $('#input-first-name').val() + ' ' + $('#input-second-name').val(),
                sex: $('#input-gender').find(':selected').text(),
                birthday: formattedDate,
                mode: "EDIT",
                old_name: _name.text()
            });

        fetch("handle-data.php", {
            "method" : "POST",
            "headers" : {
                "Content-Type" : "application/json; charset=utf-8"
            },
            "body" : dataToSend
        }).then(function(response) {
            return response.json();
        }).then(function(data) {
            console.log(data);
            if(data["type"]) {
                console.log("TRUE");
                _name.text($('#input-first-name').val() + ' ' + $('#input-second-name').val());

                let _group = _row.find('.group');
                _group.text($('#input-group').find(':selected').text());
        
                let _gender = _row.find('.gender');
                _gender.text($('#input-gender').find(':selected').text());
        
                
                let _birthday = _row.find('.birthday');
                _birthday.text(formattedDate);

                addEditStudentDialog.modal('hide');
            }
            else {
                console.log("FALSE");
                alert(data["msg"]);
            }
        })
        console.log(dataToSend);

        // addEditStudentDialog.modal('hide');
    }
})

function editStudent(btn) {
    
    _row = $(btn).parent().parent().parent();
    addEditStudentDialog.modal('show');

    $('#modal-add-edit-student .dialog-name').text('Edit Student');
    $('#btnOkAddEditStudent').text('EDIT');
    
    $('#btnOkAddEditStudent').removeAttr('class');
    $('#btnOkAddEditStudent').attr('class', 'ok edit-btn');

    console.log($('#btnOkAddEditStudent'));

}