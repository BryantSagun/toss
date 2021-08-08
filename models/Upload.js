const path = require('path')
const ToSDocument = require('./TermsOfServiceDocument')

let Upload = function(){

}

Upload.validateFileType = function(file){
     return new Promise((resolve, reject) => {
          if(path.extname(file)==".pdf"){
               resolve()
          }
          else{
               reject("Please upload a PDF file.")
          }
     })
}

// Upload.createToSDocument = function(content){
//      const tosdoc = new ToSDocument({
//           content: content.text
//      })
//      return tosdoc.save()
// }

module.exports = Upload