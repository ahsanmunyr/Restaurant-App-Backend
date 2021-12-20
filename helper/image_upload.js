'user strict';
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        console.log("Multer file ------------> ", file);
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + file.originalname)
    }
})

const fileFilter = (req, file, cb) =>{
    //reject a file
    if(file.mimetype == 'image/jpeg' || file.mimetype == 'image/png' || file.mimetype == 'image/jpg'){
        cb(null, true)
    } else{
        req.fileValidationError = "Forbidden extension";
        return cb(null, false, req.fileValidationError);
    }
};

const upload = multer({storage: storage, limits:{
    fileSize: 1024 * 1024 *5
},
    fileFilter: fileFilter
})

exports.upload = upload;