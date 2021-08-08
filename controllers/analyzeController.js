const Analyze = require('../models/Analyze')
const ToSDocument = require('../models/TermsOfServiceDocument')
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
// exports.newLoader = function(req, res){
//      Analyze.extractTextFromPDF(file).then(() => {
//           Analyze.separateSentences(req.file).then(text => {
//                Analyze.getAllStatements(Analyze.removeEmptyLines(text.split('\n'))).then((terms) => {
//                     res.render('loader')
//                     Analyze.validateAllStatements(terms, req.file)
//                }).catch(() => {
//                     res.render('404')
//                })
//           })
//      }).catch(err => {
//           console.log(err)
//      })
     // ToSDocument.findById(req.textId, function (err, docs) {
     //      if (err){
     //           res.render('404')
     //      }
     //      else{

     //      }
     // });
// }