const db = require("./models");
const morgan  = require('morgan');
const express = require('express');

const app = express();
//app.use(express.json());
const port = 8000;
app.use(morgan('dev'));
app.use(express.urlencoded({extended:false}));
app.set("view engine", "ejs")

const mapUserToView = (user) => {
	return {
		id: user.id,
		name: user.name+" "+user.lastName,
		dni: user.identification,
		rol: user.role
	};
};

const renderAdminIndex = async (res, User) => {
	const users = await User.findAll();
	const mappedUsers = users.map(mapUserToView);
	res.render('admin',{object: mappedUsers});
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
	await renderAdminIndex(res, User);
});

app.post('/admin/add',async function(req,res){
	const User=db.user;
	const params=req.body;
	const parsedParams={
		identification: params.dni,
		name: params.name,
		role: params.rol,
		lastName: params.lastname,
		username: params.user,
		password: params.pass
	};
	const newUser = await User.create(parsedParams);
	res.render('/admin/add');
});

app.get('/admin/edit/:id',async function (req,res){
	const User = db.user;
	const user = await User.findByPk(req.params.id);
	console.log('req.params = ', req.params);
	console.log('user = ', user);
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
	res.render('/admin/add');
});

app.get('/medic',function(req,res){
	
	res.render('medic',{object:users})
})
	
app.listen(8000, () => {
  console.log("up on 8000 port")
});
