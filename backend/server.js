import express, { application } from "express";
import mongoose from "mongoose";
import cors from 'cors';
import Pusher from "pusher";
// import Pusher from 'pusher-js';
import mongoData from './mongodata.js';
import groupdata from './groupdata.js';

//app config

const app = express()
const port = process.env.PORT || 9000

//For real time messaging
const pusher = new Pusher({
    appId: "1404568",
    key: "d2e40102bb65c4ab886c",
    secret: "71f904f114c67e44ed14",
    cluster: "ap4",
    useTLS: true
  });

//middlewares

app.use(cors())
app.use(express.json())

//db config

const dbConnect = 'mongodb+srv://prateek_gupta:1234@commdashcluster.l58wr.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'

mongoose.connect(dbConnect)

mongoose.connection.once('open', () => {
    console.log('DB Connected')

    const changeStream = mongoose.connection.collection('conversations').watch()

    const changegrpStream = mongoose.connection.collection('groups').watch()

    changeStream.on('change',(change) => {
        if (change.operationType === 'update') {
            pusher.trigger('chats', 'newChats', {
                //Adding a new channel real time
                'change': change
            });
            pusher.trigger('conversation', 'newMessage', {
                // Adding a new message in the database
                'change': change
            });
        } else {
            console.log('Error Triggering Pusher on chats')
        }
    })

    changegrpStream.on('change',(change) => {
        if (change.operationType === 'Insert') {
            pusher.trigger('grps', 'newgrps', {
                //Adding a new channel real time
                'change': change
            });
        } else if (change.operationType === 'update') {
            pusher.trigger('grps', 'newgrps', {
                //Adding a new channel real time
                'change': change
            });
        } else {
            console.log('Error Triggering Pusher on groups')
        }
    })
})
//api routes

app.get('/',(req,res) => res.status(200).send('Hello Communicators'))

//Login
app.post('/login' , (req,res) => {
    const dbData = req.body
    mongoData.create(dbData, (err,data) => {
        if (err) {
            res.status(500).send(err)
        } else {
            res.status(201).send(data)
        }
    })
})

//  New Groups
app.post('/new/groups',(req,res) => {

    const dbData = req.body
    groupdata.create(dbData, (err,data) => {
        if (err) {
            res.status(500).send(err)
        } else {
            res.status(201).send(data)
        }
    })
})

// get All User Data list
app.get('/get/users',(req,res) => {
    
    mongoData.find({},(err,data) => {
        if (err) {
            res.status(500).send(err)
        } else {   
            let users = {}
            data.map((dat) => {
                users[dat._id] = dat.user
            })       
            res.status(200).send(users)
        } 
    })
})

// get All Group Data list
app.get('/get/groups',(req,res) => {

    groupdata.find({},(err,data) => {
        if (err) {
            res.status(500).send(err)
        } else {        
            let grp_list = []
            data.map((info) => {
                grp_list.push(info)
            })
            res.status(200).send(grp_list)
        } 
    })
})

// creating new channel
app.post('/new/chat', (req,res) => {
    const dbData = req.body
    const id = req.query.id

    mongoData.updateOne( 
        {_id: id}, 
        { $push: { chats : dbData}},
        (err,data) => {
        if (err) {
            res.status(500).send(err)
        } else {
            res.status(201).send(data)
        }
    })
})

// Adding new group
app.post('/add/group', (req,res) => {
    const dbData = req.body
    const id = req.query.id
    mongoData.updateOne( 
        {_id: id}, 
        { $push: { groups : dbData}},
        (err,data) => {
        if (err) {
            res.status(500).send(err)
        } else {
            res.status(201).send(data)
        }
    })
})

// Adding new group
app.post('/add/people', (req,res) => {
    const dbData = req.body
    const id = req.query.id
    mongoData.updateOne( 
        {_id: id}, 
        { $push: { people : dbData}},
        (err,data) => {
        if (err) {
            res.status(500).send(err)
        } else {
            res.status(201).send(data)
        }
    })
})
//Adding new message
app.post('/new/message',(req,res) => {
    const id = req.query.id
    const newMsg = req.body
    const category = req.query.type
    const name = req.query.title
    
    let set = `${category}.$[ele].conversation`;


    mongoData.findOneAndUpdate( {_id: id,  [[category].name]:name},
        { $push: {[set]: newMsg}},
        { arrayFilters: [
            {
                "ele.name": name
            }
          ],
        new: true
    },(err,data) =>{
        if(err) {
            res.status(500).send(err)
        } else {
            res.status(201).send(data)
        }
    })
})

// Adding new Group Message
app.post('/new/groupmessage',(req,res) => {
    const grpid = req.query.id
    const newMsg = req.body

    groupdata.findOneAndUpdate( {_id: grpid },
        { $push: {conversation: newMsg}},
        (err,data) =>{
        if(err) {
            res.status(500).send(err)
        } else {
            res.status(201).send(data)
        }
    })
})

// get All Chats list names
app.get('/get/chatlist',(req,res) => {
    const id = req.query.id
    mongoData.find({_id: id},(err,data) => {
        if (err) {
            res.status(500).send(err)
        } else {
            let chatsList = []
            if (data[0].chats) {
                data[0].chats.map((chat) => {
                    chatsList.push(chat)
                })
            }          
            res.status(200).send(chatsList)
        } 
    })
})

// get all people List names
app.get('/get/peoplelist',(req,res) => {
    const id = req.query.id
    mongoData.find({_id: id},(err,data) => {
        if (err) {
            console.log(data)
            res.status(500).send(err)
        } else {
            let peopleList = []
            console.log(data[0])
            if (data[0].people) {
                data[0].people.map((peps) => {
                    peopleList.push(peps)
                })
            }          
            res.status(200).send(peopleList)
        } 
    })
})

// get all group List names
app.get('/get/grouplist',(req,res) => {
    const id = req.query.id
    mongoData.find({_id: id},(err,data) => {
        if (err) {
            res.status(500).send(err)
        } else {
            let groupList = []
            if (data[0].groups) {
                data[0].groups.map((grp) => {
                    groupList.push(grp)
                })
            }          
            res.status(200).send(groupList)
        } 
    })
})

// get active conversation

app.get('/get/conversation',(req,res) => {
    const id = req.query.id
    const channel = req.query.type
    const channel_name = req.query.title

    mongoData.find({_id: id}, 
        (err,data) => {
            let conversation = data[0][channel]
            if (err) {
                res.status(500).send(err)
            } else {
                conversation.map((conv) => {
                    if (conv.name == channel_name) {
                        res.status(201).send(conv.conversation)
                    }
                }) 
            }
        })
})

app.get('/get/groupconversation',(req,res) => {
    const id = req.query.id
    const channel = req.query.type
    const channel_name = req.query.title

    groupdata.find({_id: id}, 
        (err,data) => {
            let conversation = data
            if (err) {
                res.status(500).send(err)
            } else {
                res.status(201).send(conversation[0].conversation)
            }
        })
})

// listen

app.listen(port, () => console.log(`Listening to Localhost: ${port}`))
