const Analyze = require('../models/Analyze')
const ToSDocument = require('../models/TermsOfServiceDocument')

exports.loader = function(req, res){
     ToSDocument.findById(req.textId, function (err, docs) {
          if (err){
               res.render('404')
          }
          else{
               Analyze.separateSentences(docs.content).then(text => {
                    Analyze.getAllStatements(Analyze.removeEmptyLines(text.split('\n'))).then((terms) => {
                         res.render('loader')
                         Analyze.validateAllStatements(terms, req.file)
                    }).catch(() => {
                         res.render('404')
                    })
               })
               // Analyze.extractTextFromPDF(file).then(text => {
                    
               // }).catch(err => {
               //      console.log(err)
               // })
          }
      });
}