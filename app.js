const express = require("express");
const bodyParser = require("body-parser");
const ejs  = require("ejs");
const fetch = require("node-fetch");
const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");

let details={
	gamePic:[],
	gameName:[],
	gamePublisher:[],
	gamedesc:[],
	gameLink:[]
}


app.get("/",(req,res)=>{
	console.log(res.statusCode);
	res.render("index",{gamePics:details.gamePic,gameTitle:details.gameName,gamePubs:details.gamePublisher,gameDescs:details.gamedesc,gameLinks:details.gameLink});
})
app.get("/about",(req,res)=>{
	res.render("about");
})
app.get("/contact",(req,res)=>{
	res.render("contact");
})

app.post("/",async (req,res)=>{
	const platform = req.body.platform;
	const category = req.body.category;
	const sortBy = req.body.sortBy;
	details.gamePic=[];
	details.gameName=[];
	details.gamePublisher=[];
	details.gamedesc=[];
	details.gameLink=[];
	const url = "https://www.freetogame.com/api/games?platform="+platform+"&category="+category+"&sort-by="+sortBy;
	try{
		const response = await fetch(url);
		const gameData = await response.json();
		gameData.forEach(async(element)=>{
			const picOfGame = element.thumbnail;
			const nameOfGame = element.title;
			const publisherOfGame = element.publisher;
			const descOfGame = element.short_description;
			const linkOfGame = element.game_url;
			details.gamePic.push(picOfGame);
			details.gameName.push(nameOfGame);
			details.gamePublisher.push(publisherOfGame);
			details.gamedesc.push(descOfGame);
			details.gameLink.push(linkOfGame);
		})
	}catch(error){
		console.error(error);
		res.status(500).send("Error not fetching");
		res.redirect("/");
	}
	res.redirect("/");
	
	
	
	

})

app.listen(process.env.PORT||3000,()=>{
	console.log("Server started ....");
})