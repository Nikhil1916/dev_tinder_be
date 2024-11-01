const express = require('express');

const app = express();


app.use("/test",(req,res)=>{
    return res.json({
        msg:"done",
    })
});

app.listen(3000,()=>{
    console.log("listening on 3000");
})