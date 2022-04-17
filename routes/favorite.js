const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mysql = require('mysql');

const connection = mysql.createConnection({
  host     : 'database-1.c8m11vbpw1st.ap-northeast-2.rds.amazonaws.com',
  port     : 3306,
  user     : 'admin',
  password : 'abcd1234',
  database : 'final'
});

/* GET users listing. */
router.get('/', function(req, res, next) {
  if(!req.session.is_logined){
    res.redirect('signin');
  }else{
    const user_no = req.session.user_no;
    connection.query('select name, address from favor_park_seoul where user_no=?', [user_no], (err,data)=>{

       var template = `
       <!DOCTYPE html>
       <html lang="en">
       <head>
           <meta charset="UTF-8">
           <meta http-equiv="X-UA-Compatible" content="IE=edge">
           <meta name="viewport" content="width=device-width, initial-scale=1.0">
           <title>Document</title>
           <link href='https://fonts.googleapis.com/css?family=Roboto:400,100,300,700' rel='stylesheet' type='text/css'>
	         <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css">
           <link rel="stylesheet" href="stylesheets/favoritepage.css">
           <link rel="stylesheet" href="stylesheets/button.css">
           <link rel="stylesheet" href="stylesheets/checkbox.css">
       </head>
       <body>
       <a href="/"><img src="images/parkinglogo.png" width="300" height="300"></a>
          <center>
            <img src="images/favoritelogo.png" width="300" height="300" style="margin-top: -250px">
          </center>
       <section class="ftco-section">
       <div class="container">
             <div class="row justify-content-center">
               <div class="col-md-6 text-center mb-5">
               </div>
             </div>
            <div class="row">
               <div class="col-md-12">
                   <table class="table table-bordered table-dark table-hover">
                   <thead>
                     <tr>
                       <th><div class="checkbox-group">
                       <input type="checkbox" id="custom-checkbox" class="custom-checkbox">
                       <span class="custom-checkbox-span" tabindex="0"></span>
                        </div></th>
                       <th>No.        </th>
                       <th>주차장명   </th>
                       <th>주소   </th>
                     </tr>
                   </thead>
                   `;
                  for(var i = 0; i < data.length; i++){
                   template += `
                   <tr>
                   <th><div class="checkbox-group">
                   <input type="checkbox" id="custom-checkbox" class="custom-checkbox">
                   <span class="custom-checkbox-span" tabindex="0"></span>
                    </div></th>
                     <th scope="row">${i + 1}</th>
                     <td>${data[i]['name']}</td>
                     <td>${data[i]['address']}</td>
                     <th>
                       <form method='post' action='/favorite/delete'>
                         <button type="submit" name='delname' value=${data[i]['name']} class='tablebtn'>삭제</button>
                       </form>
                     </th>
                   `;
                 }
                 template +=`
                   </table>
                 </div>
              </div>
          </div>
        </body>
       </html>
          `;
          res.send(template);
          })
        }
  });

router.post('/delete', (req,res)=>{
    const name = req.body.delname;
    const user_no = req.session.user_no;

    connection.query('delete from favor_park_seoul where name=? and user_no=?', [name, user_no], (err,data)=>{
    if(err){
      console.log(err);
    }else{
      console.log('delete success');
      res.redirect('/favorite')
      console.log(name);
    }
  });
})

module.exports = router;
