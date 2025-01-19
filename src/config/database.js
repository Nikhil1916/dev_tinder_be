const moongose = require("mongoose");
const connectDB = async () => {
    await moongose.connect(
        process.env.DB_CONNECTION_SECRET
    );
}

module.exports = {
    connectDB
}