import mongoose from "mongoose";

//mongoose schema for chats
const avatar = "https://www.business2community.com/wp-content/uploads/2017/08/blank-profile-picture-973460_640.png"
const commdashSchema = mongoose.Schema({
    user : {
        firstName: String,
        lastName: String,
        email: String,
        profession: String,
        userImage: {type: String, default: "https://www.business2community.com/wp-content/uploads/2017/08/blank-profile-picture-973460_640.png"}
    },
    avatar: {type: String, default: "https://www.business2community.com/wp-content/uploads/2017/08/blank-profile-picture-973460_640.png"},
    chats: [{
                name: String, 
                conversation: [
                    {
                        message: String,
                        timestamp: String,
                        user: String,
                        userImage: {type: String, default: avatar}
                    }
                ]
            }],
    groups:[ {
        name: String,
        grp_id: String,
    }],
    people: [{
        id: String,
        name: String,
        relation : [{name: String}],
        conversation: [
            {
                message: String,
                timestamp: String,
                user: String,
                userImage: {type: String, default: avatar}
            }
        ]
    }
    ]
})

export default mongoose.model('conversations', commdashSchema)