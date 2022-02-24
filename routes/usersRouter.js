const usersRouter = require("express").Router();
const pool = require("../db");
const bcrypt=require("bcrypt");

usersRouter.post("/register",async (req,res)=> {
    const username = req.body.username
    const password = req.body.password


})

usersRouter.post("/", async(req, res) => {
    const username=req.body.username;
    const password=req.body.password;
    

    
    
    const hashedPassword = await bcrypt.hash(password, 10);
    //console.log(hashedPassword)
  
  
  pool
  .query(`SELECT * FROM credentials WHERE username = '${username}'`)
  .then(async(data) => {
    
    if (data.rows.length > 0) {
        
        const correctPassword = await bcrypt.compare(password, data.rows[0].password);
        

      if(correctPassword){
      res.status(200).json({ msg: "login successful" });
      return;
    } else {
        res.status(400).json({ msg: "password did not match" });
        return;
    }

      
    } else {
        res.status(400).json({ msg: "user does not exist" });
        return;
    }
})
.catch((err) => {
    console.log(err)
    res.status(500).json({ msg: "Unable to query database" });
  });
});

module.exports = usersRouter;
