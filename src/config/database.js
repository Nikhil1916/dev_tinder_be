const moongose = require("mongoose");

const connectDB = async () => {
    await moongose.connect(
        "mongodb+srv://nikhilchawla9013:h4r9fAT7H2myO4RM@cluster0.mtup7.mongodb.net/devtinder?retryWrites=true&w=majority&appName=Cluster0"
    );
}

module.exports = {
    connectDB
}