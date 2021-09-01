const Result = require('../models/Result')
const path = require('path')
goodPredictionCount = 0
badPredictionCount = 0

exports.results = function(req, res){
     Result.getDocumentStatistics(predictions).then(() => {
          goodPredictionCount = 0
          badPredictionCount = 0
          getGoodAndBadPredictionCount(predictions.collectingPrediction)
          getGoodAndBadPredictionCount(predictions.usingPrediction)
          getGoodAndBadPredictionCount(predictions.sharingPrediction)
          Result.getDocumentInfo(path.resolve('./tosDocumentsServer', pdf)).then((docInfo) => {
               req.flash('numpages', docInfo.numpages + '')
               req.flash('statementCount', (
                    statements.collectingData.length + 
                    statements.usingData.length +
                    statements.sharingData.length) + '')
               req.flash('goodPredictionCount', goodPredictionCount+'')
               req.flash('badPredictionCount', badPredictionCount+'')
               res.render('results', {
                    numpages: req.flash('numpages'),
                    statementCount: req.flash('statementCount'),
                    goodPredictionCount: req.flash('goodPredictionCount'),
                    badPredictionCount: req.flash('badPredictionCount')
               })
          }).catch((err) => {
               console.log(err)
               res.render('404')
          })
     }).catch((err) => {
          console.log(err)
          res.render('404')
     })
}

exports.report = function(req, res){
     Result.generateReport(statements,  predictions, totalStmtCount, info).then(([report, reportName]) => {
          res.download(path.resolve('/reports/', reportName))
     })
}

getGoodAndBadPredictionCount = function(predictions){
     for(counter = 0; counter < predictions.length; counter++){
          if(predictions[counter] == 1) goodPredictionCount++
          else badPredictionCount++
     }
}