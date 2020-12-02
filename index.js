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

const mapCaseToView = (casee) => {
	return {
		id: casee.id,
		name: casee.nombre + " " + casee.apellido,
		dni: casee.cedula,
		examen: casee.examen
	};
};

const renderAdminIndex = async (res, User) => {
	const users = await User.findAll();
	const mappedUsers = users.map(mapUserToView);
	res.render('admin',{object: mappedUsers});
};

const renderHelperIndex = async (res, Case) => {
	const cases = await Case.findAll();
	const mappedCases = cases.map(mapCaseToView);
	res.render('helper',{object: mappedCases});
};

app.get('/',(req,res) =>{
	res.render('index');
});

app.post('/ingreso', async function (req, res) {
  const params = req.body;
  const User = db.user;
  const Case = db.Cases;
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
		await renderAdminIndex(res, User);
	}
	if (user.role === 'medic') {
		res.render('medic',{object: mappedUsers});
	}
	if (user.role === 'helper') {
		await renderHelperIndex(res, Case);
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
	await renderAdminIndex(res, User);
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
	await renderAdminIndex(res, User);
});

app.get('/medic',function(req,res){
	
	res.render('medic',{object:users})
});

app.post('/helper/add', async (req, res) => {
	const Case = db.Cases;
	const params= req.body;
	const parsedParams={
		nombre: params.name,
		apellido: params.lastname,
		cedula: params.dni,
		sexo: params.sex,
		nacimiento: params.birthdate,
		casa: params.homeDir,
		trabajo: params.jobDir,
		examen: params.examResult,
		fechaex: params.examDate
	};
	const newCase = await Case.create(parsedParams);
	await renderHelperIndex(res, Case);
});

app.get('/helper/edit/:id', async function (req,res){
	const Case = db.Cases;
	const Status = db.Status;
	const casee = await Case.findByPk(req.params.id);
	const statuses = await Status.findAll({
		where: {
			idcaso: casee.id
		}
	});
	
	res.render('helperEdit', {object: casee, history: statuses});
});

app.post('/helper/edit/:id', async function (req, res){
	const Case = db.Cases;
	const casee = await Case.findByPk(req.params.id);
	if (req.body.name !== "")
		casee.nombre = req.body.name;
	if (req.body.lastname !== "")
		casee.apellido = req.body.lastname;
	if (req.body.dni !== "")
		casee.cedula = req.body.dni;
	if (req.body.sex !== "")
		casee.sexo = req.body.sex;
	if (req.body.birthdate !== "")
		casee.nacimiento = req.body.birthdate;
	if (req.body.homeDir !== "")
		casee.casa = req.body.homeDir;
	if (req.body.jobDir !== "")
		casee.trabajo = req.body.jobDir;
	if (req.body.examResult !== "")
		casee.examen = req.body.examResult;
	if (req.body.examDate !== "")
		casee.fechaex = req.body.examDate;

	await casee.save();

	if (!!req.body.newState && !!req.body.newStateDate) {
		const Status = db.Status;
		const newStatus = await Status.create({
			estado: req.body.newState,
			fechaestado: req.body.newStateDate,
			cedula: req.body.dni,
			nombre: req.body.name + " " + req.body.lastname,
			idcaso: casee.id
		});
	};
	await renderHelperIndex(res, Case);
});

app.listen(8000, () => {
  console.log("up on 8000 port")
});
