const addChatDialog = $("#modal-add-chat")

const btnAddChat = $("#btnAddChat")

let chosen_users = []

let cur_chat_id = 0;

fetch("/api/students/")
    .then(response => response.json())
    .then(data => {
        data.forEach(student => {
            $("#users-list").append("<option value='" + student.name + "'>" + student.name + "</option>")
        });
    })

fetch("/api/chats")
.then(response => response.json())
.then(data => {
    if(data.status === 'error') {

    } else {
        fetch("/api/active-account")
        .then(response => response.json())
        .then(activeUser => {
            data.forEach(chat => {
                if(chat.users.includes(activeUser.name))
                    addChat(chat)
            });
        })
    }
})

btnAddChat.click(() => {
    $('.invalid-msg').parent().parent().hide();


    fetch("/api/active-account")
    .then(response => response.json())
    .then(data => {
        chosen_users.push(data.name)
    })

    addChatDialog.modal('show');
})

$("#add-user").click(() => {
    $('.invalid-msg').parent().parent().hide();
    if(!chosen_users.includes($("#users-list").val())) {
        chosen_users.push($("#users-list").val());
        $("#choosen-users").append("<label style='padding:0 10px;'>" + $("#users-list").val() +"</label>")
    } else {
        $('.invalid-msg').parent().parent().show();
    }
})

$("#btnOkayAddChat").click(async () => {
    const dataToSend = JSON.stringify({
        users: chosen_users,
        msgs: []
    })

    fetch("/api/add-chat", {
        "method" : "POST",
        "headers" : {
            "Content-Type" : "application/json; charset=utf-8"
        },
        "body" : dataToSend
    })
    .then(response => response.json())
    .then(data => {
        if(data.status === 'error') {

        } else {
            console.log(data)
            addChat(data)
        }
    })

    chosen_users = [];
    $("#choosen-users").empty()

    

    addChatDialog.modal('hide');
})

$('.close-dialog').click(function () {
    addChatDialog.modal('hide');
    fetch("/api/active-account")
    .then(response => response.json())
    .then(data => {
        chosen_users.splice(chosen_users.indexOf(data.name), 1)
    })
    return;
});

async function addChat(data) {
    const chat =
    $("<a class='user' onclick='changeActiveChat(this)'></a>")

    let chat_name;


    if(data.users.length < 3) {
        chat_name = data.users[0];

        await fetch("/api/active-account")
        .then(response => response.json())
        .then(activeUser => {
            if(chat_name == activeUser.name){
                chat_name = data.users[1];
            }
        })

        const dataToSend = JSON.stringify({
            name: chat_name
        })

        chat.append(`<img
        src="../img/avatar.png"
        class="profile-img"
        alt="Profile image"
        />
        <label class='name'>`+ chat_name + `</label>`)

        fetch("/api/get-student", {
            "method" : "POST",
            "headers" : {
                "Content-Type" : "application/json; charset=utf-8"
            },
            "body" : dataToSend
        })
        .then(response => response.json())
        .then(data => {
            if(data.status === 'online') {
                chat.append(`
                    <label class="status-bull active">
                        &bull;
                    </label>`)
            } else {
                chat.append(`
                    <label class="status-bull ">
                        &bull;
                    </label>`)
            }
        })

        chat.append(`<input type="hidden" value="`+ data._id +`">`)
    } else {
        chat_name = "Group"
        
        chat.append(`<img
        src="../img/avatar.png"
        class="profile-img"
        alt="Profile image"
        />
        <label class="name">`+ chat_name + `</label>
        <input type="hidden" value="`+ data._id +`">`
    )

    }

    (chat).insertBefore("#btnAddChat")
}

function changeActiveChat(btn) {
    if(cur_chat_id) {
        const activeChat = document.getElementsByClassName("selected")[0]
        activeChat.setAttribute("class", "user")
    }
    btn.setAttribute("class", "user selected")

    cur_chat_id = document.getElementsByClassName("selected")[0].getElementsByTagName("input")[0].value

    updateChat()
}

async function updateChat() {
    $(".message-container").empty()
    $(".with-whom").empty()

    const dataToSend = JSON.stringify({
        _id: cur_chat_id
    })

    console.log(dataToSend)

    fetch("/api/find-chat", {
        "method" : "POST",
        "headers" : {
            "Content-Type" : "application/json; charset=utf-8"
        },
        "body" : dataToSend
    })
    .then(response => response.json())
    .then(data => {
        if(data.status === 'error') {

        } else {
            fetch("/api/active-account")
            .then(response => response.json())
            .then(activeUser => {
                let all_users = ""
                data.users.forEach(user => {
                    if(user != activeUser.name)
                    all_users += user + ", "
                });
                all_users = all_users.substring(0, all_users.length - 2)
                $(".with-whom").text(all_users)   
                
                data.msgs.forEach(message => {
                    createMessage(message, activeUser)
                });
            })  
        }
    })
}

function createMessage(msg, activeUser) {

    const message = $("<div class='message'></div>")
    console.log("AUTHOR:", msg.author)
    console.log("ACTIVE USER:", activeUser.name)
    if(msg.author == activeUser.name) {
        message.attr("class", "message message-my")
        message.append(`
        <div class="message-box">
            <label class="message-text">
            ` + msg.msg + `
            </label>
            <label class="author">
                ` + "Me" + `
            </label>
        </div>
        `)
    } else {
        message.attr("class", "message message-other")
        message.append(`
        <div class="message-box">
            <label class="message-text">
            ` + msg.msg + `
            </label>
            <label class="author">
                ` + msg.author + `
            </label>
        </div>
        `)
    }

    $(".message-container").append(message)
}

function isThisChat(other_id) {
    return cur_chat_id == other_id
}

function unreadenMessageIndicate(chat_id) {
    $("input").each((idx, el) => {
        if($(el).val() == chat_id) {
            console.log($(el).parent())
            $(el).parent().attr("class", "user new-message")
            return;
        }
    })
}