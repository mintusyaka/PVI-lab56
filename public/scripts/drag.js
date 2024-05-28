const draggables = document.querySelectorAll(".task")
const droppables = document.querySelectorAll(".kanban")

draggables.forEach((task) => {
    task.addEventListener("dragstart", () => {
        task.classList.add("is-dragging")
    })
    task.addEventListener("dragend", () => {
        task.classList.remove("is-dragging")

        const type = task.parentNode.classList

        console.log(task.childNodes[1].value, type[1])

        fetch("/api/change-task", {
            "method": "POST",
            "headers" :  {
                "Content-Type" : "application/json; charset=utf-8"
            },
            "body" : JSON.stringify({
                id: task.childNodes[1].value,
                type: type[1]
            })
        })
        .then(response => response.json())
        .then(data => {
            console.log(data)
        })
    })
})

droppables.forEach((zone) => {
    zone.addEventListener("dragover", (e) => {
        e.preventDefault();

        const bottomTask = insertAboveTask(zone, e.clientY)
        const curTask = document.querySelector(".is-dragging");

        if(!bottomTask) {
            zone.appendChild(curTask);
        } else {
            zone.insertBefore(curTask, bottomTask)
        }
    })
})

function insertAboveTask(zone, mouseY) {
   const els = zone.querySelectorAll(".task:not(.is-dragging)")
   
   let closestTask = null
   let closestOffset = Number.NEGATIVE_INFINITY

   els.forEach((task) => {
    const {top} = task.getBoundingClientRect();
    const offset = mouseY - top;

    if(offset < 0 && offset > closestOffset) {
        closestOffset = offset;
        closestTask = task;
    }
   })

   return closestTask;
}
