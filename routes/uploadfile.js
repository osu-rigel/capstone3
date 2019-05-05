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
            const db = require ('../db.js');           // To go down one directory we use .. here.
            console.log(req.file);
            
            //res.send('test');
            console.log('file received');
            //console.log(req);
            
            db.query('Insert INTO file (name,type, size) VALUES (?,?,?)',[req.file.filename,req.file.mimetype,req.file.size],function(error,results,fields){  
                if(error) throw error;
                console.log("Inserted data");
                
                // db.query('SELECT LAST_INSERT_ID(), name from file',function(error,results,fields){
                //     if(err) throw error;
                    
                //     console.log("Results are: ");
                //     console.log(results[0].name);
                //     imgName = results[0].name;
                // });
               
            });
            var message = "Successfully! uploaded";
            console.log("Image name here as well");
            var imgName = req.file.filename;
            console.log(imgName);
            res.render('image',{message: message,imgName: imgName});
            
            
            
        }
        
    });
    //res.send('test');
})


module.exports = router;