const btn = document.getElementById("add-todo")
const input = document.getElementById("input-todo")
const todo = document.getElementsByClassName("to-do")[0]

function addNewTask() {
    const value = input.value

    if(!value) return;

    const newTask = document.createElement("label")
    newTask.classList.add("task")
    newTask.setAttribute("draggable", "true")
    newTask.innerHTML = value

    const _id = document.createElement("input")
    _id.setAttribute("type", "hidden")

    fetch("/api/add-task", {
        "method": "POST",
        "headers" :  {
            "Content-Type" : "application/json; charset=utf-8"
        },
        "body" : JSON.stringify({
            type: "to-do",
            text: value
        })
    })
    .then(response => response.json())
    .then(data => {
        _id.setAttribute("value", data._id)
    })

    newTask.appendChild(_id)

    newTask.addEventListener("dragstart", () => {
        newTask.classList.add("is-dragging")
    })

    newTask.addEventListener("dragend", () => {
        newTask.classList.remove("is-dragging")

        const type = newTask.parentNode.classList

        console.log(newTask.childNodes[1].value, type[1])

        fetch("/api/change-task", {
            "method": "POST",
            "headers" :  {
                "Content-Type" : "application/json; charset=utf-8"
            },
            "body" : JSON.stringify({
                id: newTask.childNodes[1].value,
                type: type[1]
            })
        })
        .then(response => response.json())
        .then(data => {
            console.log(data)
        })
    })

    todo.appendChild(newTask)

    input.value = ""


    return {
        type: newTask.parentNode.classList[1],
        text: newTask.innerHTML
    };
}

window.addEventListener("load", (e) => {
    e.preventDefault()

    fetch("/api/get-tasks")
    .then(response => response.json())
    .then(data => {
        data.forEach(task => {
            const newTask = document.createElement("label")
            newTask.classList.add("task")
            newTask.setAttribute("draggable", "true")
            newTask.innerHTML = task.text

            const _id = document.createElement("input")
            _id.setAttribute("type", "hidden")
            _id.setAttribute("value", task._id)

            newTask.appendChild(_id)

            newTask.addEventListener("dragstart", () => {
                newTask.classList.add("is-dragging")
            })
        
            newTask.addEventListener("dragend", () => {
                newTask.classList.remove("is-dragging")
        
                const type = newTask.parentNode.classList
        
                console.log(newTask.childNodes[1].value, type[1])
        
                fetch("/api/change-task", {
                    "method": "POST",
                    "headers" :  {
                        "Content-Type" : "application/json; charset=utf-8"
                    },
                    "body" : JSON.stringify({
                        id: newTask.childNodes[1].value,
                        type: type[1]
                    })
                })
                .then(response => response.json())
                .then(data => {
                    console.log(data)
                })
            })

            const card = document.getElementsByClassName(task.type)[0]

            card.appendChild(newTask)
        });
    })
})