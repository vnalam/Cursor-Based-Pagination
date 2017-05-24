var express = require('express');
var router = express.Router();
var Sequelize = require('sequelize');
var cacher = require('sequelize-redis-cache');
var redis = require('redis');
var rc = redis.createClient(6379, 'localhost');
var sequelize = new Sequelize('vinay', 'root', 'vinayraj4', {
  host: "127.0.0.1",
  port: 3306,
  maxConcurrentQueries: 1000,
  dialect: 'mariadb'
  })
  
  var User = sequelize.define('home', {
			eName:Sequelize.STRING,
			eEmail: Sequelize.STRING,
			salary: Sequelize.INTEGER
		 });
			
var cacheObj = cacher(sequelize, rc)
		.model('home')
		.ttl(1000);
		
router.get('/api/retrieve/:page', function(req, res) 
	{
		
		cacheObj.findAndCountAll({}).then(function(user) 
		{
			var v = user.count;
			//res.json({"output":v})
			console.log(v);
			var totalrows = v,
			pageSize = 2,
			
			currentPage = 1,
			
			rowsArrays = [], 
			rowsList = [];
			
			
			
			cacheObj.findAll({}).then(function(data) 
		{
			//console.log(JSON.stringify(data));
			
			var a=data;
		while(data.length>0){
			rowsArrays.push(a.splice(0, pageSize));
		}
		if (typeof req.params.page !== 'undefined') {
		currentPage = +req.params.page;
		}
		
		rowsList = rowsArrays[+currentPage - 1];
		
		console.log(JSON.stringify(rowsList));
		res.json(rowsList);
		
		});
	
	});
});	
	
	
	
	
module.exports = router;
