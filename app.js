const express=require('express')
const expressLayouts=require('express-ejs-layouts')
const config=require('config')
//mongoose 
const mongoose=require('mongoose')
const app=express()

//DB cofig
const db=config.get('mongoURI')

//connect to mongo
mongoose.connect(db,{useNewUrlParser:true,useUnifiedTopology:true})
.then(()=> console.log('MongoDb connected.....'))
.catch(err => console.log(err))

//EJS
app.use(expressLayouts)
app.set('view engine','ejs')

//Bodyparser
app.use(express.urlencoded({extended:false}))

//Routes
app.use('/',require('./routes/index'))
app.use('/users',require('./routes/users'))


const port=process.env.PORT || 5000

app.listen(port,()=>{
    console.log(`server is running on ${port}`)
})