const express = require('express')
const router = express.Router()
const upload = require('./controllers/uploadController')
const home = require('./controllers/homeController')
const result = require('./controllers/resultController')
const analyze = require('./controllers/analyzeController')

router.get('/', upload.index);
router.get('/about', home.about);
router.get('/features', home.features);

router.post('/analyze', upload.upload);
router.post('/results', result.results);
router.post('/results/download', result.report)

module.exports = router