const router = require('express').Router();

const File = require('../models/file');

router.get('/:uuid', async (req, res) => {

    //looking for file in database
    const file = await  File.findOne({ uuid: req.params.uuid });

    if (!file) {
        return res.render('download', { error: 'Link has been expired' });
    }
    //the filePath will give us the path where our file is stored
    const filePath = `${__dirname}/../${file.path}`;

    //to download just call the res.download with the path where the file is stored
    res.download(filePath);


});

module.exports = router;