const PDFDocument = require('pdfkit')
const fs = require('fs')

let Result = function(){}

Result.getDocumentStatistics = function(predictions){
     return new Promise((resolve, reject) => {
          ratings = {
               collectingDataRating: calculateRating
               (predictions.collectingPrediction.length, getBadStmtCount(predictions.collectingPrediction), 0.1),
               usingDataRating: calculateRating
               (predictions.usingPrediction.length, getBadStmtCount(predictions.usingPrediction), 0.1),
               sharingDataRating: calculateRating
               (predictions.sharingPrediction.length, getBadStmtCount(predictions.sharingPrediction), 0.5),
               updatingToSRating: calculateRating
               (predictions.updatingPrediction.length, getBadStmtCount(predictions.updatingPrediction), 0.3),
          }
          finalEvaluation = evaluateRatings(ratings).toFixed(2)
          resolve(ratings, finalEvaluation)
     })
}

Result.generateReport = function(statements, predictions, document){
     return new Promise((resolve, reject) => {
          let date = new Date();
          const report = new PDFDocument();
          report.pipe(fs.createWriteStream('report.pdf'))
          report.font('Times-Bold')
          .fontSize(30)
          .image('public/assets/img/toss-2.png', {
               fit: [50, 50],
               align: 'center'
          }).text('Terms of Service Simplifier', {
               align: 'center'
          }).font('Times-Roman')
          .fontSize(10)
          .text('SUMMARY REPORT FOR DOCUMENT NAME', {
               align: 'center'
          })
          .moveDown(4)
          .text("Date: "
          + (date.getMonth()+1) + "/"
          + date.getDate() + "/"
          + date.getFullYear() + " "
          + "Time: "
          + (date.getHours()%12) + ":"
          + date.getMinutes() + ":"
          + date.getSeconds(), {
               align: 'left'
          })
          .moveDown(2)

          getListOfStatements(report, statements.collectingData, predictions.collectingPrediction, "Collecting Data Statements")
          getListOfStatements(report, statements.usingData, predictions.usingPrediction, "Using Data Statements")
          getListOfStatements(report, statements.sharingData, predictions.sharingPrediction, "Sharing Data Statements")
          getListOfStatements(report, statements.updatingToS, predictions.updatingPrediction, "Updating ToS Statements")
          report.fillColor('black')
          .text("Total number of statements: " +
          (statements.collectingData.length +
          statements.usingData.length +
          statements.sharingData.length +
          statements.updatingToS.length))
          .text("Collecting Data Category: " + statements.collectingData.length)
          .text("Using Data Category: " + statements.usingData.length)
          .text("Sharing Data Category: " + statements.sharingData.length)
          .text("Updating ToS Category: " + statements.updatingToS.length)
          report.end()
          resolve(report)
     })
}

getListOfStatements = function(report, statements, predictions, category){
     count = 1
     report.fill('black').font('Times-Bold').text(category, {
          align: 'center'
     })
     .font('Times-Roman')
     statements.forEach(statement => {
          if(predictions[count-1] == 0) report.fillColor('red').text("["+count+"] " + statement, {
               align: 'justify'
          })
          else report.fill('black').text("["+count+"] " + statement, {
               align: 'justify'
          })
          count++
     })
     report
     .moveDown()
}

evaluateRatings = function(ratings){
     evaluation = ratings.collectingDataRating + ratings.usingDataRating + ratings.sharingDataRating + ratings.updatingToSRating
     return evaluation
}

calculateRating = function(totalStmtCount, badStmtCount, weight){
     if(totalStmtCount == 0) return 0
     return Math.round(((((badStmtCount / totalStmtCount) * 100) * weight)+ Number.EPSILON)*100/100)
}

getBadStmtCount = function(predictions){
     badPredCount = 0
     for(counter = 0; counter < predictions.length; counter++){
          if(predictions[counter] == 0){
               badPredCount++
          }
     }
     return badPredCount
}

module.exports = Result