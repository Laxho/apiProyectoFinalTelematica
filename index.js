
const express = require('express')
const app = express();
//app.use(express.json());
const port = 8000;
app.set("view engine", "ejs")
app.get('/',(req,res) =>{
	res.render('index')
});

app.post('/ingreso', function (req, res) {
  const params = req.body;
	console.log(params);
});

app.listen(8000, () => {
  console.log('Example app listening on port 8000!')
});
