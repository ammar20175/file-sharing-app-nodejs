const router = require('express').Router();

const multer = require("multer");

const File = require('../models/file')

const path = require('path');

const { v4: uuidv4 } = require('uuid');

const file = require('../models/file');

//storing file

let storage = multer.diskStorage({

    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;

        //calling cb now
        cb(null, uniqueName);
    }
});

//in below where single is pass we have to pass the name for eg in  our form(html) were we have give name flied value
let upload = multer({
    storage,
    limit: { fileSize: 1000 * 100 }, //100mb
}).single('myfile');

// route for uploading the file
router.post('/', (req, res) => {

    //store file

    upload(req, res, async (err) => {

        //validate request

        if (!req.file) {
            return res.json({ error: 'All fields are required' })
        }

        if (err) {
            return res.status(500).send({ error: err.message })
        }

        //store into Database

        const file = new File({
            filename: req.file.filename,
            uuid: uuidv4(),
            path: req.file.path,
            size: req.file.size

        });

        const response = await file.save();

        return res.json({ file: `${process.env.APP_BASE_URL}/files/${response.uuid}` })

    });

    //Response --> Link

});

//router for sending email
router.post('/send', async (req, res) => {

    const { uuid, emailTo, emailFrom } = req.body;

    if (!uuid || !emailTo || !emailFrom) {
        return res.status(422).send({ error: 'All fields are required' })
    }

    //get data from db
    try {
        const file = await File.findOne({ uuid: uuid });


        if (file.sender) {
            return res.status(422).send({ error: 'Email already sent once' });
        }

        file.sender = emailFrom;
        file.receiver = emailTo;

        //saving the sender and receiver email into db

        const response = await file.save();

        //sending email
        const sendMail = require('../services/mailService');
        sendMail({
            from: emailFrom,
            to: emailTo,
            subject: 'inshare file sharing',
            text: `${emailFrom} shared a file with you`,
            html: require('../services/emailTemplate')({
                emailFrom: emailFrom,
                downloadLink: `${process.env.APP_BASE_URL}/files/${file.uuid}`,
                size: parseInt(file.size / 1000) + 'KB',
                expires: '24 hours'
            })
        });

        return res.send({ success: true });



    } catch (error) {
        return res.status(500).send({ error: 'something went wrong' });
    }

});


module.exports = router