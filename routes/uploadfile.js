var express = require('express');
var router = express.Router();



router.get('/', (req, res) => {
    res.render('fileupload');
});

router.post('/', (req, res) => {
    global.upload(req,res,function(err){
        if(err){
            res.render('fileupload',{msg:err});
            console.log(err);
        }else{
            console.log(req.file);
            res.send('test');
        }
        
    });
    //res.send('test');
})


module.exports = router;