const Analyze = require('../models/Analyze')

exports.loader = function(req, res){
     let documentName = req.body.pdf + ""
     Analyze.extractTextFromPDF(req.body.pdf).then(text => {
          Analyze.getAllStatements(Analyze.removeEmptyLines(text.split('\n'))).then((terms) => {
               res.render('loader')
               Analyze.validateAllStatements(terms)
               Analyze.getDocumentInfo(req.body.pdf, documentName)
          }).catch(() => {
               res.render('404')
          })
     })
}