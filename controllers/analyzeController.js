const Analyze = require('../models/Analyze')
const Upload = require('../models/Upload')

exports.loader = function(req, res){
     Analyze.extractTextFromPDF(req.body.pdf).then(async text => {
          Analyze.getAllStatements(Analyze.removeEmptyLines(text.split('\n'))).then((terms) => {
               res.render('loader')
               Analyze.validateAllStatements(terms)
          }).catch(() => {
               res.render('404')
          })
     })
}