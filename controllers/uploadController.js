const Upload = require('../models/Upload')
const AnalyzeController = require('./analyzeController')
const pdfparse = require('pdf-parse')

exports.index = function(req, res){
     //req.session.isAuth = true;
     res.render('', {errors: req.flash('errors')})
}

exports.upload = function(req, res){
     file = req.file
     if(file){
          file = req.file.filename
          Upload.validateFileType(file).then(()=>{
               pdfparse('./tosDocumentsServer/' + file).then((content)=>{
                    AnalyzeController.loader(req, res)
                    // Upload.createToSDocument(content).then(record => {
                    //      AnalyzeController.loader(req, res)
                    //      req.textId = record._id
                    // }).catch(()=>{})
               }).catch((err)=>{
                    console.log(err)
                    req.flash('errors', 'Unknown error occurred.')
                    res.redirect('/')
               })
          }).catch(err => {
               req.flash('errors', err)
               res.redirect('/')
          })
     }
     else{
          req.flash('errors', 'Please Upload Your Document First.')
          res.redirect('/')
     }
}