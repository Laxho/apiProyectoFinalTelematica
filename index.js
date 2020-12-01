const db = require("./models");
const morgan  = require('morgan');
const express = require('express');

const app = express();
//app.use(express.json());
const port = 8000;
app.use(morgan('dev'));
app.use(express.urlencoded({extended:false}));
app.set("view engine", "ejs")
app.get('/',(req,res) =>{

	res.render('index')
});

app.post('/ingreso', function (req, res) {
  const params = req.body;
	console.log(params);
});
app.get('/admin/add',async function (req,res){
	console.log(req.body);
	const User =db.user;
	const users =await User.findAll();
	const mappedUsers = users.map(function(user){
		return {
		name:user.name+" "+user.lastName,
		dni:user.identification,
		rol:user.role

		};
	});
	res.render('admin',{object:mappedUsers});
});

app.post('/admin/add',async function(req,res){
	const User=db.user;
	const params=req.body;
	const parsedParams={
		identification:params.dni,
		name:params.name,
		lastName:params.lastname,
		username:params.username,
		password:params.pass
	};
	const newUser = await User.create(parsedParams);
	console.log(newUser);
	const users =await User.findAll();
	console.log("////////////////////////////////////////////////////////////////////////////////");
	console.log(req.body);
	res.render('admin',{object:users})
})
app.get('/medic',function(req,res){
	
	res.render('medic',{object:users})
})
	
app.listen(8000, () => {
  console.log("up on 8000 port")
});
