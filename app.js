const express = require('express');
const app = express();
const expressLayouts = require('express-ejs-layouts');
const router = require('./router')
const session = require('express-session')
const flash = require('connect-flash')
const PORT = process.env.PORT || 3000
const cors = require('cors')
const use = require('@tensorflow-models/universal-sentence-encoder');
tokenizer = use.load().then(useObj => {
          model = useObj.model;
          return useObj.tokenizer
     })

app.use(express.static('public'));
app.use(expressLayouts)
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors())
app.set('view engine', 'ejs');
app.use(session({
     secret: 'termsofservicesimplifier',
     cookie: { maxAge: 60000 },
     resave: false,
     saveUninitialized: false
}))
app.use(flash())
app.use('/', router);
app.use(function(req, res){
     res.status(404)
     res.render('404')
})

app.listen(PORT);
