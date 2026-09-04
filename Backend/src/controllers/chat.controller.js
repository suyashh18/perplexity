import chatModel from "../models/chat.model.js"
import messageModel from "../models/message.model.js"
import userModel from "../models/user.model.js"
import {  generateChatTitle, generateResponse } from "../services/ai.service.js"

export const sendMessage= async (req,res)=>{
    const {message,chatId}= req.body
     

    let title = null
    let chat = null;
    if(!chatId){
   
    title = await generateChatTitle(message)
     chat = await chatModel.create({
        user :req.user.id,
        title
    })
}

    const usermessage = await messageModel.create({
        chat:chatId || chat._id,
        content:message,
        role:'user'
    })
    const messages  = await messageModel.find({chat:chatId || chat._id})
    const result = await generateResponse(messages)

    const aiMessage= await messageModel.create({
        chat:chatId || chat._id,
        content:result,
        role:'ai'
    })
   
    
    res.status(201).json({
       title,
       chat,
       aiMessage
    })
}


export const getChats = async(req,res)=>{
    const user = req.user
    const chats = await chatModel.find({user:user.id})
    res.status(200).json({
        message:"chats retrived successfully",
        chats
    })
}

export async function getMessages(req,res){
    const {chatId} = req.params

    const chat = await chatModel.find({
        _id:chatId,
        user:req.user.id
    })
    if(!chat){
        return res.status(404).json({
            message:'chat not found'
        })
    }

    const messages = await messageModel.find({
        chat:chatId
    })
    res.status(200).json({
        message:'messsages retrieved sucessfully',
        messages
    })
}

export async function deleteChat(req, res) {

    const { chatId } = req.params;

    const chat = await chatModel.findOneAndDelete({
        _id: chatId,
        user: req.user.id
    })

    await messageModel.deleteMany({
        chat: chatId
    })

    if (!chat) {
        return res.status(404).json({
            message: "Chat not found"
        })
    }

    res.status(200).json({
        message: "Chat deleted successfully"
    })
}