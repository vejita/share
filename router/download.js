const router = require('express').Router();
const File = require('../models/filemodel');

// downloding file
const downloadBtnControler = async (req, res) => {
    const file = await File.findOne({ uuid: req.params.uuid });
    if (!file) {
        return res.render('download', { error: 'Link has been expired' });
    }

    const filePath = `${__dirname}/../${file.path}`;
    res.download(filePath);
};

router.get('/:uuid', downloadBtnControler);

module.exports = router;
