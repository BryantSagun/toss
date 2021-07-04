const Upload = require('../models/Upload')
const AnalyzeController = require('./analyzeController')
const pdfparse = require('pdf-parse')

exports.index = function(req, res){
     res.render('', {errors: req.flash('errors')})
}

exports.upload = function(req, res){
     file = req.body.pdf
     if(file){
          Upload.validateFileType(file).then(()=>{
               pdfparse(file).then(()=>{
                    AnalyzeController.loader(req, res)
               }).catch(()=>{
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