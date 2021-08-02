const express = require('express')
const router = express.Router()
const upload = require('./controllers/uploadController')
const home = require('./controllers/homeController')
const result = require('./controllers/resultController')
const multer = require('multer')
const fileStorageEngine = multer.diskStorage({
     destination: (req, file, callback) => {
          callback(null, './tosDocumentsServer')
     },
     filename: (req, file, callback) => {
          callback(null, Date.now()+ '--' + file.originalname)
     }
})
const uploadEngine = multer({storage: fileStorageEngine})

router.get('/', upload.index);
router.get('/about', home.about);
router.get('/features', home.features);

router.post('/analyze', uploadEngine.single('pdf'), upload.upload);
router.post('/results', result.results);
router.post('/results/download', result.report)

module.exports = router