const express=require('express')

const router=express.Router();
const User=require('../models/User')
const bcrypt=require('bcryptjs')
const config=require('config')
const jwt=require('jsonwebtoken')
const randomurl=require('random-url')

router.get('/login',(req,res)=>{
    res.render('login')
})
router.get('/register',(req,res)=>{
    res.render('register')
})

router.get('/dashboard',(req,res)=>{
    res.render('dashboard')
})


router.post('/register',async(req,res)=>{

    try{
    const {name,email,password}=req.body
    
    let errors=[]

    //Check for required field
    if(!name||!email||!password)
    {
        console.log("1",password)
        errors.push({msg:'please fill the required field'})
    }
  console.log(errors)
    if(password && password.length<6)
    {
           console.log("2")
        errors.push({msg:'Pssword should be at least 6 characters'})
    }
      
    if(errors.length>0){
        //if errors again render registration form
        // res.render('register',{
        //     errors,
        //     name,
        //     email,
        //     password
        // })
        console.log(errors)
        return res.json(errors)
    }
    
    else{
        const user=await User.findOne({email})
            if(user){
                errors.push({msg:'Email is already registered'})
                // res.render('register',{
                // errors,
                // name,
                // email,
                // password
                // })
                return res.json(errors)
            }

                //hash password
       
            const hashPassword=await bcrypt.hash(password,8)
          
             const userDetails={
                 name,
                 email,
                 password:hashPassword
             }
             console.log(userDetails)
             const newUser=new User(userDetails)

            await        newUser.save()
                    
            //    return res.json(newUser)
                    
                            res.redirect('/users/login')
                        

                    
             
            
        
    }
}
        catch(err){
            res.json(err)
        }
    })
   



    

router.post('/login',async(req,res)=>{
    try{
     const { email,password }=req.body

    const user=await User.findOne({email})
    if(!user)
    return res.json({msg:'please enter valid email'})

                         const decoded=await bcrypt.compare(password,user.password)
                              if(!decoded)
                                return res.json({msg:'please enter correct password'})
                         const token=jwt.sign({email},config.get('jwtsecret'),{expiresIn:3600})
                         //res.json(token)
                         res.redirect('/users/dashboard')

    }

    catch(err){
        res.json(err)
    }
  
                            

                            
                          

    

    
})

router.get('/logout', (req, res) => {
  //req.logout();
  res.redirect('/users/login');
})

router.get('/newurl',(req,res)=>{
    res.json(randomurl('https'))
})

module.exports=router