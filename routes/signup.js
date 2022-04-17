const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const mysql = require('mysql');

const connection = mysql.createConnection({
  host     : 'database-1.c8m11vbpw1st.ap-northeast-2.rds.amazonaws.com',
  port     : 3306,
  user     : 'admin',
  password : 'abcd1234',
  database : 'final'
});

router.get('/',(req, res) => {
  res.render('signup');
});

router.post('/', (req,res) => {
  var id = req.body.id;
  var pw = req.body.pw;
  var name = req.body.name;

  connection.query('select * from user where id = ?', [id], (err, data) => {
    if(err){
      console.log(err)
      res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
      res.write('<script>alert("중복된 ID")</script>');
      res.write('<script>window.location="/signup"</script>');
    } else{
      console.log('회원가입 성공');
      connection.query('insert into user(id, pw, name) values(?,?,?)', [id, pw, name]);
      res.redirect('/');
    }
  });
})

module.exports = router;
