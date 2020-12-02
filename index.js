const db = require("./models");
const morgan  = require('morgan');
const express = require('express');

const app = express();
//app.use(express.json());
const port = 8000;
app.use(morgan('dev'));
app.use(express.urlencoded({extended:false}));
app.set("view engine", "ejs")

const mapUserToView = user => {
	return {
		name:user.name+" "+user.lastName,
		dni:user.identification,
		rol:user.role
	};
};

app.get('/',(req,res) =>{
	res.render('index');
});

app.post('/ingreso', async function (req, res) {
  const params = req.body;
  const User = db.user;
  const users = await User.findAll({
	  where: {
		  username: params.user
	  }
  });
  console.log('users = ', users);
  const user = users[0];
  console.log('user = ', user);
  if (!!user && user.password === params.pass) {
	const mappedUsers = [user].map(mapUserToView);
	if (user.role === 'admin') {
		res.render('admin',{object: mappedUsers});
	}
	if (user.role === 'medic') {
		res.render('medic',{object: mappedUsers});
	}
	if (user.role === 'helper') {
		res.render('/helper',{object: mappedUsers});
	}
  } else {
	res.render('index');
  }
});
app.get('/admin/add',async function (req,res){
	console.log(req.body);
	const User =db.user;
	const users =await User.findAll();
	const mappedUsers = users.map(mapUserToView);
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
});

app.get('/admin/edit/:id',async function (req,res){
	console.log('req.body = ', req.body);
	console.log('req.id = ', req.id);
	res.render('admin',{object:[]});
});

app.get('/medic',function(req,res){
	
	res.render('medic',{object:users})
})
	
app.listen(8000, () => {
  console.log("up on 8000 port")
});
