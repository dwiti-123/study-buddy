import rateLimit from "express-rate-limit";

const limitter = rateLimit({
    windowMs: 15*60*1000, //15min
   max : 5 ,//limit each IP to 5 request for windows
   message:{
    message:"Too many request login attemts after 15 min"
   },
   standardHeaders:true,
   legacyHeaders:true
})

//app.post('/login', loginLimiter, loginController);
