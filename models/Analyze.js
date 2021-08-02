require("@tensorflow/tfjs-node")
_tokenizer = null
const fs = require('fs')
const pdfparse = require('pdf-parse')
const tf = require('@tensorflow/tfjs')
const LEN = 70

let Analyze = function(){}

Analyze.extractTextFromPDF = function(pdf){
     return new Promise((resolve, reject) => {
          pdfparse(pdf).then((data)=>{
               resolve(separateSentences(data.text))
          }).catch((err)=>{
               console.log(err)
               reject(err)
          })
     })
}

Analyze.removeEmptyLines = function(content){
     regexEmptyLine = /^\s*$/
     for(i=0; i<content.length; i++){
          if(regexEmptyLine.test(content[i])){
               content.splice(i,1)
          }
     }
     return content
}

Analyze.getAllStatements = function(text){
     return new Promise((resolve, reject) => {
          statements = {
               collectingData: categorizeStatements(text,
               /(may\s)?(also\s)?(receive?|store?|collect?|process?(\s|ing|ed|ion)?(?!ive))(personal\s)?((information|data)?)/igm),
               usingData: categorizeStatements(text,
               /(may\s)?(also\s)?(us(e|ing)(?!r)|process)(personal\s)?((information|data)?)/igm),
               sharingData: categorizeStatements(text,
               /(third\s)?(part(y|ies)(\s)?)?(may\s)?(also\s)?(shar(e|ed|ing)|disclose)\s?(your(\s)?)?(user(\s)?)?(personal(\s)?)?(information|data(\s)?)?(outside)?/igm)
               // updatingToS: categorizeStatements(text,
               // /(reserves\s)?(the)?(right)?(to)?updat(e|ing)(from)?(time\sto\stime)?/igm),
          }
          totalStmtCount = statements.collectingData.length + statements.usingData.length + statements.sharingData.length
          resolve(statements, totalStmtCount)
     })
}

Analyze.validateAllStatements = function(statements, document){
     return new Promise(async (resolve, reject) => {
          const CollectingModel = await tf.loadLayersModel("http://127.0.0.1:8080/models/collecting/model.json");
          const UsingModel = await tf.loadLayersModel("http://127.0.0.1:8080/models/using/model.json");
          const SharingModel = await tf.loadLayersModel("http://127.0.0.1:8080/models/sharing/model.json");
          _tokenizer = await tokenizer
          predictions = {
               collectingPrediction: await predictStatement(statements.collectingData, CollectingModel, 1013),
               usingPrediction: await predictStatement(statements.usingData, UsingModel, 921),
               sharingPrediction: await predictStatement(statements.sharingData, SharingModel, 801)
          }
          info = {
               documentName: document.originalname
          }
          pdf = document.filename
          resolve(statements, predictions, info, pdf)
     })
}

categorizeStatements = function(content, regex){
     statements = []
     for(i=0; i<content.length; i++){
          if(regex.test(content[i])){
               statements.push(content[i])
          }
     }
     return statements
}

predictStatement = function(statements, Tmodel, vocabSize){
     return new Promise(resolve => {
          predictions = []
          statements.forEach((statement) => {
               predictions.push(Math.round(Tmodel.predict(preprocess(statement,vocabSize)).dataSync()))
          })
          resolve(predictions)
     })
}

separateSentences = function(content){
     regexRemoveNextLine = /(\r\n|\n|\r)/gm
     regexAddNextLine = /(?<![0-9]|www|e|inc|my)\.(?!com|net|g\.)|;|•/ig
     regexReplace = /•|●|○/ig
     content = content.replace(regexRemoveNextLine, "")
     content = content.replace(regexAddNextLine, "$&\n")
     content = content.replace(regexReplace, "")

     return content
}

preprocess = function(statement,vocab_len){
     tokenized = _tokenizer.encode(statement);
     tokenized = tokenized.filter(x => x <= vocab_len)
     tokenized.splice(LEN)
     slen = tokenized.length
     tokenized = tf.tensor1d(tokenized,dtype='int32').expandDims();
     tokenized = tf.pad(
          tokenized, [[0,0],[0,LEN-slen]]
     )
     return tokenized
}






Analyze.getDocumentInfo = function(pdf){
     return new Promise((resolve, reject) => {
          pdfparse(pdf).then((docInfo)=>{
               resolve(docInfo)
          }).catch((err)=>{
               console.log(err)
               reject(err)
          })
     })
}

Analyze.savePDFContentsInSingleTextFile = function(content){
     fs.writeFile('./statements/privacy-policy.txt', content, function (err) {
          if (err) throw err;
     })
}

Analyze.savePDFContentsInTextFiles = function(content){
     for(i=0; i<content.length; i++){
          console.log('saving statement ' + (i+1) + '...')
          fs.writeFile('./statements/'+ (i+1) +'.txt', content[i], function (err) {
               if (err) throw err;
          })
     }
}

module.exports = Analyze
