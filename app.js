const express = require('express');
const app = express();
const expressLayouts = require('express-ejs-layouts');
const router = require('./router')
const session = require('express-session')
const flash = require('connect-flash')
const mongoose = require('mongoose')
const PORT = 3000
const dbURI = 'mongodb+srv://tossadmin:tossadmin@cluster0.th2be.mongodb.net/toss?retryWrites=true&w=majority';
const use = require('@tensorflow-models/universal-sentence-encoder');
tokenizer = use.load().then(useObj => {
          model = useObj.model;
          return useObj.tokenizer
     })

app.use(express.static('public'));
app.use(expressLayouts)
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.set('view engine', 'ejs');
app.use(session({
     secret: 'secret',
     cookie: { maxAge: 60000 },
     resave: false,
     saveUninitialized: false
}))
app.use(flash())
app.use('/', router);
app.use(function(req, res, next){
     next()
})
app.use(function(req, res){
     res.status(404)
     res.render('404')
})
// mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true }).then(()=>{
//      app.listen(PORT);
// }).catch((err) => {
//      console.log(err)
// })

app.listen(PORT);
