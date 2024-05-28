import mongoose, { mongo } from 'mongoose'

const taskSchema = mongoose.Schema({
    text: {
        type: String,
        required: true
    },
    
    type: {
        type: String,
        required: true
    }
})

export const Task = mongoose.model("Task", taskSchema)