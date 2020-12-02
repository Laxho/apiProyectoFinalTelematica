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

const renderAdminIndex = (res) => {
	const users = await User.findAll();
	res.render('admin',{object:users});
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
	renderAdminIndex(res);
});

app.get('/admin/edit/:id',async function (req,res){
	const User = db.user;
	const user = await User.findByPk(req.params.id);
	res.render('adminEdit', {object: user});
});

app.post('/admin/edit/:id',async function (req, res){
	const User = db.user;
	const user = await User.findByPk(req.params.id);
	if (req.body.name !== "")
		user.name = req.body.name;
	if (req.body.lastname !== "")
		user.lastName = req.body.lastname;
	if (req.body.dni !== "")
		user.identification = req.body.dni;
	if (req.body.rol !== "")
		user.role = req.body.rol;
	if (req.body.user !== "")
		user.username = req.body.user;
	if (req.body.pass !== "")
		user.password = req.body.pass;

	await user.save();
	renderAdminIndex(res);
});

app.get('/medic',function(req,res){
	
	res.render('medic',{object:users})
})
	
app.listen(8000, () => {
  console.log("up on 8000 port")
});
