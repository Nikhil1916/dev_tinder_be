const mongoose = require("mongoose");
const connectionRequestSchema = new mongoose.Schema({
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        require: true
    },
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        require: true
    },
    status: {
        type: String,
        require: true,
        enum: {
            values:["ignored","interested","accepted","rejected"],
            message: `{VALUE} is incorrect status type`
        }
    }
},
{
    timestamps: true
});

const connectionRequestModel = new mongoose.model(
    "ConnectionRequest", connectionRequestSchema
);

module.exports = connectionRequestModel