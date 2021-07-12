const Analyze = require('../models/Analyze')
const path = require('path')

exports.loader = function(req, res){
     console.log('--- ANALYZE CONTROLLER ---')
     file = path.resolve('./tosDocuments', req.file.filename)
     Analyze.extractTextFromPDF(file).then(text => {
          Analyze.getAllStatements(Analyze.removeEmptyLines(text.split('\n'))).then((terms) => {
               res.render('loader')
               Analyze.validateAllStatements(terms, file)
          }).catch(() => {
               res.render('404')
          })
     }).catch(err => {
          console.log(err)
     })
}