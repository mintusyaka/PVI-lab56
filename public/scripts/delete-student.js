const deleteStudentDialog = $('#delete-student');

let _btn;

function deleteStudent(btn) {
    deleteStudentDialog.modal('show');
    let txtDeleteStudent = $('#delete-student .form');
    txtDeleteStudent.text("Are you sure you want to delete user " +
    btn.parentNode.parentNode.parentNode.getElementsByClassName("name")[0].innerHTML +
    "?");
    _btn = btn;
    return;
}

document.getElementById("btnOkDeleteStudent")
.addEventListener("click", async () => {
    let _name = _btn.parentNode.parentNode.parentNode.getElementsByClassName('name')[0].innerHTML;
    console.log(_name)
  
    const dataToSend = JSON.stringify(
    {
        name: _name
    });
  

    fetch("/api/delete-student", {
      "method" : "POST",
      "headers" : {
          "Content-Type" : "application/json; charset=utf-8"
      },
      "body" : dataToSend
    }).then(response => {
        return response.json();
    }).then(data => {
      console.log(data);
      if(data["type"]) {
        console.log("TRUE");
        _btn.parentNode.parentNode.parentNode.remove();
        deleteStudentDialog.modal('hide');
      } else {
        console.log("FALSE");
        alert(data["msg"]);
      }
    }).catch(error => {
        console.error('Error:', error);
    });
  });

$('.close-dialog').click(function () {
    deleteStudentDialog.modal('hide');
    return;
});