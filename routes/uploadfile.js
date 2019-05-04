var express = require('express');
var router = express.Router();
const auth = require('../utilities/authenticate');


router.get('/', (req, res) => {
    if( auth.isLoggedIn() === 0 ){
        return;
    }
    res.render('fileupload');
});

router.post('/', (req, res) => {
    if( auth.isLoggedIn() === 0 ){
        return;
    }
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