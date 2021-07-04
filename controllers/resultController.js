const Result = require('../models/Result')

exports.results = function(req, res){
     Result.getDocumentStatistics(predictions).then(() => {
          res.render('results')
     }).catch(() => {
          res.render('404')
     })
}

exports.report = function(req, res){
     Result.generateReport(statements, predictions)
}