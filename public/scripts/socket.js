// import { io } from "socket.io-client";
import { io } from "https://cdn.socket.io/4.7.5/socket.io.esm.min.js";

const URL = "http://localhost:4000";
const socket = io(URL, { autoConnect: false });

socket.onAny((event, ...args) => {
    console.log(event, args);
  });

export function onUsernameSelection(name) {
    socket.auth = { name };
    socket.connect();
  }

$("#add-todo").click(async () => {
    const dataToSend = addNewTask()
    socket.emit("new-task", dataToSend)
})

$("#message-send").click( async () => {
    // console.log("IT WOTRKS")
    let activeUser;

    await fetch("/api/active-account")
    .then(response => response.json())
    .then(data => {
        if(data.status === "error") {
            activeUser = undefined
            console.log(data)
            return;
        } else {
            activeUser = data
        }
    })

    // console.log("SKJDBUSANDANSND", activeUser)

    const dataToSend = {
        chat_id: $(".selected").children("input").val(),
        author: activeUser.name,
        msg: $("#message-input").val()
    }
    
    fetch("/api/add-message",
    {
        "method" : "POST",
        "headers" : {
            "Content-Type" : "application/json; charset=utf-8"
        },
        "body" : JSON.stringify(dataToSend)
    })


    $("#message-input").val("")

    socket.emit("new-message", dataToSend)

    createMessage(dataToSend, activeUser)
})

socket.on("new-task-listeners", (data) => {
    const msg = $(`
    <a href='./pages/tasks.html'>
        <div class="msg">NEW: ` + data.type.toUpperCase() + `: ` + data.text + `</div>
    </a>
    `)

    $(".notifications-dropdown").append(msg)

    $(".dropdown").attr("class", "dropdown new-message")
})

socket.on("new-message-listeners", (_msg) => {
    // console.log("MSG:", _msg)
    fetch("/api/find-chat", {
        "method" : "POST",
            "headers" : {
                "Content-Type" : "application/json; charset=utf-8"
            },
            "body" : JSON.stringify({
                _id: _msg.chat_id
            })
        })
        .then(response => response.json())
        .then(data => {
            fetch("/api/active-account")
            .then(response => response.json())
            .then(activeUser => {
                if(data.users.includes(activeUser.name)) {
                    if(isThisChat(data._id)) {
                        createMessage(_msg, activeUser)
                    }
                    else {
                        console.log("NEW UNREADEN")
                        unreadenMessageIndicate(data._id)
                    }
                }
            })
        })
    })

socket.on('connect', () => {
    fetch("/api/active-account")
    .then(response => response.json())
    .then(data => {
        fetch("/api/update-status/online", {
            "method" : "POST",
            "headers" : {
                "Content-Type" : "application/json; charset=utf-8"
            },
            "body" : JSON.stringify(data)
        })
        .then(response => response.json())
        .then(data => {
            console.log("socket.on connect",data)
        })
    })

})

socket.on("connect", () => {
    // fetch("/api/")

    console.log("CONNECT" + socket.auth.name) // виводжу клієнтові ж що він же і під'єднався
  });

socket.on("update_info_status", () => {
    $(".status-bull").each((idx, el) => {
        if($(el).parent().children('.name').text() != "") {
            const dataToSend = JSON.stringify({
                name: $(el).parent().children('.name').text()
            })

            console.log("DATA TO SEND", dataToSend)

            fetch("/api/get-student", {
                "method" : "POST",
                "headers" : {
                    "Content-Type" : "application/json; charset=utf-8"
                },
                "body" : dataToSend
            })
            .then(response => response.json())
            .then(data => {
                console.log(data)
                if(data.status === 'online') {
                    $(el).attr("class", "status-bull active")
                } else {
                    $(el).attr("class", "status-bull")
                }
            })
        }
    })
})

// socket.on("user_disconnected", () => {
//     console.log("socket.name")
//     // 
// })

socket.on("user_disconnected", (data) => {
    fetch("/api/update-status/offline", {
        "method" : "POST",
            "headers" : {
                "Content-Type" : "application/json; charset=utf-8"
            },
            "body" : JSON.stringify({name: data})
        })

    socket.broadcast.emit("update_info_status")
})

export default socket;