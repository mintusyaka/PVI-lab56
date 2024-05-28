/*вікно видалення студента */
const deleteStudentDialog = $('#delete-student');

let _btn;
let _row_2 = $('#table-students');

function deleteStudent(btn) {
  deleteStudentDialog.modal('show');
  let txtDeleteStudent = $('#delete-student .form');
  txtDeleteStudent.text("Are you sure you want to delete user " +
  btn.parentNode.parentNode.parentNode.getElementsByClassName("name")[0].innerHTML +
  "?");
  _btn = btn;
  return;
}

$('#btnOkDeleteStudent').click(function() {
  let _name = _btn.parentNode.parentNode.parentNode.getElementsByClassName('name')[0].innerHTML;

  const dataToSend = JSON.stringify(
    {
        name: _name
    });

  fetch("delete-student.php", {
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
      _btn.parentNode.parentNode.parentNode.remove();
      deleteStudentDialog.modal('hide');
    } else {
      console.log("FALSE");
      alert(data["msg"]);
    }
  });
});

$('.close-dialog').click(function () {
  deleteStudentDialog.modal('hide');
  return;
});

// window.addEventListener('load', () => {
//   fetch("get-students.php", {
//     "method": "GET",
//     "headers" : {
//       "Content-Type" : "application/json; charset=utf-8"
//     }
//   }).then(function(response) {
//     console.log(response);
//     return response.json();
//   }).then(function(data) {
//     console.log(data)
//     if(data['type']) {
//       console.log("TRUE LOAD STUDENTS");

//       for(let i = 0; i < data['msg'].length; ++i) {
//         let _checkbox = $('<td></td>').html('<input type="checkbox" name="checkbox" aria-label="checkbox" />');

//         let _name = $('<td class="name"></td>').text(data['msg'][i]['name']);

//         let _group = $('<td class="group"></td>').text(data['msg'][i]['group']);

//         let _gender = $('<td class="gender"></td>').text(data['msg'][i]['sex']);

//         let _status = $('<td></td>').html('&bull;');
//         _status.attr('class', 'status-bull active');

//         let _button_edit = $('<button></button>');
//         _button_edit.attr('type', 'button');
//         _button_edit.attr('onclick', 'editStudent(this)');
//         _button_edit.attr('class', 'btnEdit');
//         _button_edit.html('&#9998;');

//         let _button_delete = $('<button></button>');
//         _button_delete.attr('type', 'button');
//         _button_delete.attr('onclick', 'deleteStudent(this)');
//         _button_delete.attr('class', 'btnDelete');
//         _button_delete.html('<span>&times;</span>');


//         let _div = $('<div></div>');
//         _div.append(_button_edit);
//         _button_edit.after(_button_delete);
//         let _buttons = $('<td></td>').html(_div);

//         let _birthday = $('<td class="birthday"></td>').text(data['msg'][i]['birthday']);

//         _row_2.append($('<tr></tr>').html(_checkbox));
//         _checkbox.after(_group);
//         _group.after(_name);
//         _name.after(_gender);
//         _gender.after(_birthday);
//         _birthday.after(_status);
//         _status.after(_buttons);
//       }
//     } else {
//       console.log("CAN'T LOAD STUDENTS");
//       alert(data['msg']);
//     }
//   })
// })

// if('serviceWorker' in navigator) {
//   try {
//     const reg = navigator.serviceWorker.register('/PII/sw.js')
//     console.log("SW register success!", reg)
//   } catch (e) {
//     console.log("SW register fail!")
//   }
// }

// if("serviceWorker" in navigator) {
//   navigator.serviceWorker.register("./sw.js").then(registration => {
//     console.log("SW Registered!");
//     console.log(registration);
//   }).catch(error => {
//     console.log("SW Registration Failed!");
//     console.log(error);
//   })
// }