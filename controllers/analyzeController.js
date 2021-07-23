const Analyze = require('../models/Analyze')
const path = require('path')

exports.loader = function(req, res){
     file = path.resolve('./tosDocumentsServer', req.file.filename)
     Analyze.extractTextFromPDF(file).then(text => {
          Analyze.getAllStatements(Analyze.removeEmptyLines(text.split('\n'))).then((terms) => {
               res.render('loader')
               Analyze.validateAllStatements(terms, req.file)
          }).catch(() => {
               res.render('404')
          })
     }).catch(err => {
          console.log(err)
     })
}

exports.getLoader = function(req, res){
     file = path.resolve('./tosDocumentsServer', req.file.filename)
     Analyze.extractTextFromPDF(file).then(text => {
          Analyze.getAllStatements(Analyze.removeEmptyLines(text.split('\n'))).then((terms) => {
               res.render('loader')
               Analyze.validateAllStatements(terms, req.file)
          }).catch(() => {
               res.render('404')
          })
     }).catch(err => {
          console.log(err)
     })
}