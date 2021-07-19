const Result = require('../models/Result')
const path = require('path')

exports.results = function(req, res){
     Result.getDocumentStatistics(predictions).then(() => {
          res.render('results')
     }).catch(() => {
          res.render('404')
     })
}

exports.report = function(req, res){
     Result.generateReport(statements,  predictions, totalStmtCount, info).then(([report, reportName]) => {
          res.download(path.resolve('./reports/', reportName), reportName)
     })
}