const express = require('express');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const PassportLocal = require('passport-local').Strategy;

const app = express();


app.use(express.urlencoded({extended:true}));

//manejo de sesiones
app.use(cookieParser('contra1234'));

app.use(session({
    secret:'contra1234',
    resave: true,
    saveUninitialized: true
}));

//config passport
app.use(passport.initialize());
app.use(passport.session());
passport.use( new PassportLocal(function(username,password,done){
    if(username==="miguel" && password==="123456")
        return done(null,{id:1,name:"Miguel_1"});
    
    done(null,false);
}));
//serialización
passport.serializeUser(function(user,done){
    done(null, user.id);
});
//deserialización
passport.deserializeUser(function(id,done){
    done(null,{id:1,name:"Miguel_1"});
});


//motor de vistas
app.set('view engine','ejs');

app.get("/", (req,res,next)=>{
    if(req.isAuthenticated()) return next();

    res.redirect("login");
} ,(req,res)=>{
    
    res.render("tareas");
});

app.get("/login",(req,res)=>{
    //mostrar el login
    res.render("login"); 
});

app.post("/login",passport.authenticate('local',{
    successRedirect:"/",
    failureRedirect: "/login"
})); 

app.listen(8080,()=> console.log("Server Iniciado"));