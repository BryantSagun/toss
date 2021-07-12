const Upload = require('../models/Upload')
const AnalyzeController = require('./analyzeController')
const pdfparse = require('pdf-parse')

exports.index = function(req, res){
     res.render('', {errors: req.flash('errors')})
}

exports.upload = function(req, res){
     file = req.file
     if(file){
          file = req.file.filename
          Upload.validateFileType(file).then(()=>{
               pdfparse('./tosDocuments/' + file).then(()=>{
                    AnalyzeController.loader(req, res)
               }).catch((err)=>{
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