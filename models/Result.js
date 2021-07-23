const PDFDocument = require('pdfkit')
const fs = require('fs')
const path = require('path')
const pdfparse = require('pdf-parse')

let Result = function(){}

Result.getDocumentInfo = function(pdf){
     return new Promise((resolve, reject) => {
          pdfparse(pdf).then((docInfo)=>{
               resolve(docInfo)
          }).catch((err)=>{
               console.log(err)
               reject(err)
          })
     })
}

Result.getDocumentStatistics = function(predictions){
     return new Promise((resolve, reject) => {
          ratings = {
               collectingDataRating: getBadStmtCount(predictions.collectingPrediction),
               usingDataRating: getBadStmtCount(predictions.usingPrediction),
               sharingDataRating: getBadStmtCount(predictions.sharingPrediction),
               updatingToSRating: getBadStmtCount(predictions.updatingPrediction)
          }
          resolve(ratings)
     })
}

Result.generateReport = function(statements, predictions, totalStmtCount, info){
     return new Promise((resolve, reject) => {
          let date = new Date();
          const report = new PDFDocument({compress:false} );
          const reportName = 'toss-report' + Date.now() + '-' + info.documentName
          report.pipe(fs.createWriteStream(path.resolve('./reports/', reportName)))
          report.font('public/fonts/Quicksand-Regular.ttf')
          .fontSize(30)
          // .image('public/assets/img/toss-2.png', {
          //      fit: [50, 50],
          // })
          .text('Terms of Service Simplifier', {
               align: 'center'
          })
          .fontSize(12)
          .text('Summary Report for ' + info.documentName, {
               align: 'center'
          })
          .moveDown(4)
          .text("Date: "
          + (date.getMonth()+1) + "/"
          + date.getDate() + "/"
          + date.getFullYear() + " ", {
               align: 'left'
          })
          .text("Time: "
          + (date.getHours()<10?'0':'')
          + (date.getHours()%12) 
          + ":"
          + (date.getMinutes()<10?'0':'')
          + date.getMinutes() 
          + ":"
          + (date.getSeconds()<10?'0':'')
          + date.getSeconds()
          + (date.getHours()<12?'am':'pm'))
          .moveDown(2)
          .text("Total number of statements: " +
          totalStmtCount)
          .text("Collecting Data Category: " + statements.collectingData.length)
          .text("Using Data Category: " + statements.usingData.length)
          .text("Sharing Data Category: " + statements.sharingData.length)
          .text("Updating ToS Category: " + statements.updatingToS.length)
          .moveDown(4)
          getListOfStatements(report, statements.collectingData, predictions.collectingPrediction, "Collecting Data Statements")
          getListOfStatements(report, statements.usingData, predictions.usingPrediction, "Using Data Statements")
          getListOfStatements(report, statements.sharingData, predictions.sharingPrediction, "Sharing Data Statements")
          getListOfStatements(report, statements.updatingToS, predictions.updatingPrediction, "Updating ToS Statements")

          report.fillColor('black')
          .text('---END OF REPORT---', {
               align: 'center'
          })
          report.end()
          resolve([report, reportName])
     })
}

getListOfStatements = function(report, statements, predictions, category){
     count = 1
     report.fill('black').text(category, {
          align: 'center'
     })
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