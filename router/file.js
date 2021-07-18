// main router uplode files in server file system and send emails

const path = require('path');
const router = require('express').Router();
const multer = require('multer');
const { v4: uuid4 } = require('uuid');
const File = require('../models/filemodel');
const sendMail = require('../services/emailService');
const emailTemplate = require('../services/emailTemplate');

// using multer to uplode files

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'), // fires argumemt of this function is error which is null
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${Math.round(
            Math.random() * 1e9
        )}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    },
});

const upload = multer({
    storage,
    limits: { fileSize: 100000000 },
}).single('myfile');

const uplodingFileTOUplodesANDSavingToDB = (req, res) => {
    //store file
    upload(req, res, async (err) => {
        // validate request
        try {
            try {
            } catch (error) {
                console.log(error);
            }
            if (!req.file) {
                return res.json({
                    status: 'fail',
                    error: 'All fields are required.',
                });
            }

            if (err) {
                return res.status(500).json({
                    status: 'fail',
                    error: err.message,
                });
            }
            // store file to db
            const file = new File({
                filename: req.file.filename,
                uuid: uuid4(),
                path: req.file.path,
                size: req.file.size,
            });

            const responce = await file.save();
            return res.json({
                file: `${process.env.APP_BASE_URL}/files/${responce.uuid}`,
            });
        } catch (error) {
            console.log(error);
        }
        // http://127.0.0.1:3000/files/234563iusvbdvbsl
    });

    // response -> Link
};

const sendingmailConroler = async (req, res) => {
    const { uuid, emailTo, emailFrom } = req.body;

    if (!uuid || !emailTo || !emailFrom) {
        return res.status(422).send({ error: 'All fields are requird' });
    }

    const file = await File.findOne({ uuid: uuid });

    if (file.sender) {
        return res.status(422).send({ error: 'Email has been already send' });
    }

    file.sender = emailTo;
    file.receiver = emailFrom;

    const responce = file.save();

    // sending mail
    sendMail({
        from: emailFrom,
        to: emailTo,
        subject: 'file shearing',
        text: `${emailFrom} shared a file with you`,
        html: emailTemplate({
            emailFrom: emailFrom,
            downloadLink: `${process.env.APP_BASE_UR}/files/download/${file.uuid}`,
            size: parseInt(file.sizr / 1000) + 'kb',
            expires: '24 hours',
        }),
    });
    return res.json({
        status: 'succes',
        message: 'email send succecfully',
    });
};

router.post('/', uplodingFileTOUplodesANDSavingToDB);
router.post('/send', sendingmailConroler);

module.exports = router;
