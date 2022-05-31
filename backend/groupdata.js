import mongoose from "mongoose";

//mongoose schema for chats
const avatar = "https://www.business2community.com/wp-content/uploads/2017/08/blank-profile-picture-973460_640.png"
const commdashSchema = mongoose.Schema({
    group : {
        Name: String,
        description: String,
        admin: String,
        grpImage: {type: String, default: avatar},
    },
    conversation: [
        {
            message: String,
            timestamp: String,
            user: String,
            userImage: {type: String, default: avatar}
        }
    ]
})

export default mongoose.model('groups', commdashSchema)