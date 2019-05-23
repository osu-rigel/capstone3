var express = require('express');
var router = express.Router();
const db = require ('../utilities/db.js'); 
const auth = require('../utilities/authenticate.js');

router.get('/', (req, res) => {
    res.render('fileupload', {
        layout: false
    });
});

router.post('/', (req, res) => {
    global.upload(req,res,function(err){
        if(err){
            res.render('fileupload',{
                msg:err,
                layout: false
            });
            console.log(err);
        }else{
          // To go down one directory we use .. here.
            console.log(req.file);
            
            //res.send('test');
            console.log('file received');
            //console.log(req);
            var dbConnection = db.connect();
            dbConnection.query('Insert INTO file (name,type, size) VALUES (?,?,?)',[req.file.filename,req.file.mimetype,req.file.size],function(error,results,fields){  
                if(error) throw error;
                console.log("Inserted data");
                
                // dbConnection.query('SELECT LAST_INSERT_ID(), name from file',function(error,results,fields){
                //     if(err) throw error;
                    
                //     console.log("Results are: ");
                //     console.log(results[0].name);
                //     imgName = results[0].name;
                // });
               
            });
            // TODO : check uploadable files against LaTeX renderable graphics; file types, max file sizes 
            db.disconnect(dbConnection);
            var message = "Successfully! uploaded";
            console.log("Image name here as well");
            var imgName = req.file.filename;
            console.log(imgName);
            res.render('image',{
                message: message,
                imgName: imgName,
                layout: false
            });
        }
    });
    //res.send('test');
})

module.exports = router;
