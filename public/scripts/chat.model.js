import mongoose, { mongo } from 'mongoose'

const msgSchema = mongoose.Schema({
    author: {
        type: String,
        required: true
    },
    
    msg: {
        type: String,
        required: true
    }
})

const chatSchema = mongoose.Schema({
    users: {
        type: [String],
        required: true
    },

    msgs: {
        type: [msgSchema],
        required: false
    }    
})

export const Chat = mongoose.model("Chat", chatSchema)
export const MSG = mongoose.model("MSG", msgSchema)