const adminAuth = (req,res,next) => {
    const token = "xyz";
    if(token == "xyz") {
        next();
    } else {
        return res.status(401).send("token is wrong");
    }
}

module.exports = {
    adminAuth
}