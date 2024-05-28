import express from 'express';
import jwt from "jsonwebtoken"
import path from 'path';
import cors from 'cors'

import cookieParser from "cookie-parser";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

import {getStudents, updateStatusOnline, updateStatusOffline, getStudent, editStudent, addStudent, removeStudent} from "./database.js"

const app = express();
const PORT = process.env.PORT || 4000;

import { createServer } from "http";
import { Server } from "socket.io";

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors:
  {
    origin: "http://localhost:4000"
  }
});

import mongoose from 'mongoose'
import { Chat, MSG } from './public/scripts/chat.model.js'
import { Task } from './public/scripts/task.model.js'

// const Chat = require('./public/scripts/chat.model.js')

mongoose.connect("mongodb+srv://stanislavmintuspz2022:Yd3dUMyqNwmd9M5v@cluster0.1cw6zrk.mongodb.net/chats?retryWrites=true&w=majority&appName=Cluster0")
.then(() => {
  console.log("connected to db")
  httpServer.listen(PORT, () => {
    console.log(`Server running on PORT ${PORT}`)
  })
})
.catch((err) => {
  console.log("connection to db failed!" + err.message)
})



// Resolve __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json())
app.use(cookieParser())
app.use(cors())



io.on("connection", (socket) => {
  console.log("Socket connected ", socket.id)
  socket.broadcast.emit("update_info_status")

  const users = [];
  for (let [id, socket] of io.of("/").sockets) {
    users.push({
      userID: id,
      name: socket.name,
    });
  }
  socket.emit("users", users);
  socket.broadcast.emit("user connected", {
    userID: socket.id,
    name: socket.name,
  });

  updateStatusOnline(socket.name)

  // socket.on('disconnect', () => {
  //   onlineUpdate(socket)
  //   console.log('Socket disconnected', socket.id)
  // })

  socket.on("disconnect", () => {
    // io.emit("user_disconnected")
    // const name = socket.name;
    // updateStatusOffline(name)

    socket.broadcast.emit("user_disconnected", socket.name)
    socket.broadcast.emit("update_info_status")

    console.log('Socket disconnected', socket.id)
})

  socket.on('new-message', async (data) => {
    // console.log("NEW_MESSAGE_DATA_SERVER", data)
    socket.broadcast.emit("new-message-listeners", data)
  })

  socket.on("new-task", (data) => {
    socket.broadcast.emit("new-task-listeners", data)
  })
})

io.use((socket, next) => {
  const name = socket.handshake.auth.name;
  if (!name) {
    return next(new Error("invalid name"));
  }
  socket.name = name;
  next();
})


app.post("/api/add-task", async (req, res) => {
  try {
    const task = await Task.create(req.body)
    res.status(200).json(task)
  } catch (err) {
    res.status(500).json({status: "error", error: err.message})
  }
})

app.post("/api/change-task", async (req, res) => {
  try {
    const task = await Task.findById(req.body.id)
    task.type = req.body.type
    task.save()

    res.status(200).json(task)
  } catch (err) {
    res.status(500).json({status: "error", error: err.message})
  }
})

app.get("/api/get-tasks", async (req, res) => {
  try {
    const tasks = await Task.find({})
    
    res.status(200).json(tasks)
  } catch (err) {
    res.status(500).json({status: "error", error: err.message})
  }
})

app.post("/api/add-message", async(req, res) => {
  try {
    const id = req.body.chat_id
    const chat = await Chat.findById(id)

    const msg = await MSG.create({
      author: req.body.author,
      msg: req.body.msg
    })
    
    chat.msgs.push(msg)
    chat.save()

    // console.log(chat)
    res.status(200).json(chat)
  } catch (err) {
    res.status(500).json({status: "error", error: err.message})
  }
})

app.post("/api/add-chat", async (req, res) => {
  try {
    if(req.body.users.length < 1) {
      res.status(500).json({status: "error", error: "empty chat"})
    } else {
      const chat = await Chat.create(req.body)
      // console.log(req.body)
      res.status(200).json(chat)
    }
  } catch(err) {
    res.status(500).json({status: "error", error: err.message})
  }
})

app.post("/api/find-chat", async(req, res) => {
  try {
    const id = req.body._id
    const chat = await Chat.findById(id)
    // console.log(chat)
    res.status(200).json(chat)
  } catch (err) {
    res.status(500).json({status: "error", error: err.message})
  }
})

app.get("/api/chats", async (req, res) => {
  try {
    const chats = await Chat.find({})
    // console.log(chat)
    res.status(200).json(chats)
  } catch (err) {
    res.status(500).json({status: "error", error: err.message})
  }
})

app.post('/api/update-status/online', async (req, res) => {
  const name = req.body.name;
  await updateStatusOnline(name)
  res.json({
    status: "success",
    success: "All is okay. Status of " + name + " changed to online"
  })
});


app.post('/api/update-status/offline', async (req, res) => {
  const name = req.body.name;
  await updateStatusOffline(name)
  console.log("OFF" ,name)
  res.json({
    status: "success",
    success: "All is okay. Status of " + name + " changed to offline"
  })
});

app.get("/api/logout", async (req, res) => {
  res.clearCookie("activeUser")
})

app.get('/api/active-account', async (req,res) => {
  if(!req.cookies.activeUser) {
    res.json({
      status: "error",
      error: "no active user"
    })
  } else {
    try {
      const decoded = jwt.verify(req.cookies.activeUser, process.env.JWT_SECRET);
      
      const student = await getStudent(decoded.name);

      if(student) {
        res.json(student);
      } else {
        res.json({
          status: "error",
          error: "no match with name"
        })
      }

    } catch (err) {
      if(err) res.json({
        status: "error",
        error: "some error"
      });
    }
  }
})

app.get("/api/students", async (req, res) => {
  const students = await getStudents()
  // console.log(students)
  // console.log("asdjfd")
  res.json(students);
  // res.send();
});

app.post("/api/student", async (req, res) => {
  const name = req.body.name;
  const student = await getStudent(name)
  if(student) {
    const token = jwt.sign({name: student.name}, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES,
    })
    const cookieOptions = {
      expiresIn: new Date(Date.now() + process.env.COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
    }

    res.cookie("activeUser", token, cookieOptions)

    res.json(student)
  }
  else
    res.json({
      status: "error",
      error: "Student doesn't exist"
    })
})

app.post("/api/get-student", async (req, res) => {
  const name = req.body.name
  const student = await getStudent(name)
  res.json(student)
})

app.post("/api/delete-student", async (req, res) => {
  const body = req.body;
  console.log(body)
  const name = body.name;
  await removeStudent(name);
  res.json({
    type: true,
    msg: "OKAY"
  });
});

app.post("/api/add-new-student", async (req, res) => {
  const body = req.body;
  // console.log(body)
  const result = await addStudent(body.group, body.name, body.sex, body.birthday);
  if(result) {
    res.json({
      type: true,
      msg: "OKAY ADDED"
    });
  } else {
    res.json({
      type: false,
      msg: "FAILED: Incorrect name"
    });
  }
});

app.post("/api/edit-student", async (req, res) => {
  const body = req.body;
  console.log(body);
  await editStudent([body.name, body.birthday, body.sex, body.group, body.old_name]);
  res.json({
    type: true,
    msg: "OKAY EDITED"
  });
});

app.post("/api/change-account", async (req, res) => {

});