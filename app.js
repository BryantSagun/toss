const express = require('express');
const app = new express();
const expressLayouts = require('express-ejs-layouts');
const router = require('./router')
const session = require('express-session')
const mongoDBSession = require('connect-mongodb-session')(session);
const mongoose = require('mongoose')
const flash = require('connect-flash')
const PORT = process.env.PORT || 3000
const cors = require('cors')
const use = require('@tensorflow-models/universal-sentence-encoder');
tokenizer = use.load().then(useObj => {
     model = useObj.model;
     return useObj.tokenizer
})
const mongoURI = "mongodb+srv://tossadmin:tossadmin@cluster0.th2be.mongodb.net/toss?retryWrites=true&w=majority"
mongoose.connect(mongoURI, {
     useNewUrlParser: true,
     useCreateIndex: true,
     useUnifiedTopology: true
}).then((res) => {
     app.listen(PORT);
})
const store = new mongoDBSession({
     uri: mongoURI,
     collection: 'tossSessions'
})
const oneDay = 1000 * 60 * 60 * 24;
app.use(session({
     secret: 'termsofservicesimplifier',
     resave: false,
     saveUninitialized: false,
     cookie: { maxAge: oneDay },
     store: store
}))
app.use(express.static('public'));
app.use(expressLayouts)
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors())
app.set('view engine', 'ejs');
app.use(flash())
app.use('/', router);
app.use(function(req, res){
     res.status(404)
     res.render('404')
})
