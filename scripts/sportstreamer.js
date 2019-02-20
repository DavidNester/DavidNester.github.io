//**************************
//AUTHOR: DAVID NESTER
//There is a lot of modulation that needs to happen here
//**************************
var getUrl = window.location;
var baseUrl = getUrl .protocol + "//" + getUrl.host + "/" //+ getUrl.pathname.split('/')[1];
var forum = "";
var game = "";
//Sport Buttons
var sports_list = ["Soccer", "NFL", "NBA", "NCAA FB", "NCAA BB", "MLB", "NHL", "Golf", "Cricket", "MMA"];
//need to make dumb fix for soccer
//https://old.reddit.com/r/SoccerStream69/
//https://www.reddit.com/r/soccerstreams_other
var addresses = ["https://old.reddit.com/r/SoccerStream69/","https://old.reddit.com/r/nflstreams/","https://old.reddit.com/r/nbastreams/", "https://old.reddit.com/r/CFBStreams/", "https://old.reddit.com/r/ncaaBBallStreams/", "https://old.reddit.com/r/MLBStreams/", "https://old.reddit.com/r/NHLStreams/", "https://old.reddit.com/r/PuttStreams/", "https://old.reddit.com/r/cricket_streams/", "https://old.reddit.com/r/MMAStreams/"]
var norm_addresses = ["https://www.reddit.com/r/soccerstreams_pl/", "https://www.reddit.com/r/nflstreams/", "https://www.reddit.com/r/nbastreams/", "https://www.reddit.com/r/CFBStreams/", "https://www.reddit.com/r/ncaaBBallStreams/", "https://www.reddit.com/r/MLBStreams/", "https://www.reddit.com/r/NHLStreams/", "https://www.reddit.com/r/PuttStreams/", "https://www.reddit.com/r/cricket_streams/", "https://www.reddit.com/r/MMAStreams/"]
var sports = document.getElementById('sports');
var text = "";
for (i = 0; i < sports_list.length; i++) {
	text += "<li><button class=\"sports\" onclick='getGames(\"" + addresses[i]+"\",\""+ sports_list[i] + "\")'>" + sports_list[i] + "</button></li>"
}
sports.innerHTML = text;

function makeRedditLink(link) {
	//turns relative reddit url into full url
	var newLink = link.slice(baseUrl.length);
	var finalLink = "https://old.reddit.com/" + newLink;
	return finalLink;
}

function makeHttpObject() {
  try {return new XMLHttpRequest();}
  catch (error) {console.log("error with XHTTP request")}
  try {return new ActiveXObject("Msxml2.XMLHTTP");}
  catch (error) {}
  try {return new ActiveXObject("Microsoft.XMLHTTP");}
  catch (error) {}

  throw new Error("Could not create HTTP request object.");
}
var request = makeHttpObject();
request.onerror = function() {alert("Something went wrong! Unable to get games")}

function getGames(url,sport) {
	//scrapes games from forum page
	//makes naive assumption that games have number in post title
	forum = url
	var label = document.getElementById('gamelabel');
	label.innerHTML=sport;
	//solves cross origin for now
	url = "https://cors-anywhere.herokuapp.com/" + url;
	var links = document.getElementById('web');
	links.innerHTML = ""
	var aces = document.getElementById('ace');
	aces.innerHTML = "";
	var games = document.getElementById('games');
	games.innerHTML = "<center>...Getting Games...</center>"
	request.open("GET", url, true);
	request.send(null);
	request.onreadystatechange = function() {
		if (request.readyState == 4){
			parseGames(request.responseText)
			}
			
		}
	};
}
function soccerWorkaround(current) {
	request.open("GET", "https://cors-anywhere.herokuapp.com/https://old.reddit.com/r/soccerstreams_other/",true);
	request.send(null);
	request.onreadystatechange = function() {
		if (request.readyState == 4) {
			parseGames(current + request.responseText);
		}
	};
}
//not currently used but could be used when its made asynchronous
function getHTML(url) {
	request.open("GET", url, true);
	request.send(null);
	request.onreadystatechange = function() {
		if (request.readyState == 4){
			return request.responseText;
		}
	};
}
function parseGames(html) {
	//parses html from forum page
	var rawHTML = html
	var doc = document.createElement("html");
	doc.innerHTML = rawHTML;
	var links = doc.getElementsByClassName('title may-blank')
	var urls = [];
	//alert(links.length);
	for (var i=0, max=links.length; i<max; i++) {
		if (/\d/.test(links[i].text)) {
			if (!links[i].href.includes("alb.reddit.com")) {
				urls.push(makeRedditLink(links[i].href));
				urls.push(links[i].text);
			}
    	}
	}
	makeGameButtons(urls);
}
function makeGameButtons(urls) {
	//makes game buttons from results of scraping
	var games = document.getElementById('games');
	text = ""
	for (i = 0; i < urls.length; i += 2) {
		text += "<li><button onclick='getLinks(\""+ urls[i] +"\")' style=\"height:40px;\">" + urls[i+1] + "</button></li>"
	}
	if (text == "") {
		text = "<center><li><b>No Games Found?</b></li>\n" + 
		        "<li>Make sure games are scheduled</li>"+
		        "<li><a target= \"_blank\" style=\"color:black;\" href=\""+ forum +"\"><button>Go To Forum</button></a></li></center>"
	}
	games.innerHTML = text;
}
function getLinks(url){
	//scrape links from post
	game = url;
	//quick dumb fix
	url = "https://cors-anywhere.herokuapp.com/" + url;
	var links = document.getElementById('web');
	text = "<center>...Getting Links...</center>"
	links.innerHTML = text
	request.open("GET", url, true);
	request.send(null);
	request.onreadystatechange = function() {
		if (request.readyState == 4){
    		parseLinks(request.responseText);
    	}
    };
}
function acestreams(html) {
	//get all acestreams
	var ace = new Array()
	var myArray;
	var re = /\bacestream:\/\/[-a-zA-Z0-9 \[\]]*[^$<]/g
	//sometimes comes before...
	while ((myArray = re.exec(html)) !== null) {
		ace.push(myArray[0])
	}
	var acestreams = new Set(ace)
	var allData = Array.from(acestreams)
	var linkAndData = new Array()
	for (i=0; i < allData.length; i++) {
		total = allData[i].split(" ")
		linkAndData.push(total[0])
		linkAndData.push(total.splice(1,total.length).join(" "))
	}
	return linkAndData
}
function parseLinks(html) {
	var rawHTML = html
	var doc = document.createElement("html");
	doc.innerHTML = rawHTML;
	var links = doc.getElementsByTagName('a')
	var urls = [];
	//alert(links.length);
	for (var i=0, max=links.length; i<max; i++) {
		var rel = links[i].rel;
		//console.log(rel)
		if (rel == "nofollow") {
			if (!links[i].href.includes('https://www.reddit.com/r/')) {
				if (!links[i].href.includes('https://old.reddit.com/r/')) {
					if (!links[i].href.includes(baseUrl)) {
						if (links[i].href.length > 100) {
							urls.push(links[i].hostname);
						}
						else {
	    					urls.push(links[i].href);
	    				}
	    			}
    			}
    		}
    	}
	}
	makeLinkButtons(urls, acestreams(html));
}
function makeLinkButtons(urls, aces) {
	var links = document.getElementById('web');
	text = ""
	for (i = 0; i < urls.length; i++) {
		text += "<li><a href=\""+ urls[i] +"\" target=\"_blank\"><button>" + urls[i] + "</button></a></li>"
	}
	if (text == "") {
		text = "<center><li><b>No Links Found</b></li>\n" + 
		        "<li><a target= \"_blank\" style=\"color:black;\" href=\""+ game +"\"><button>Go To Post</button></a></li></center>"
	}
	links.innerHTML = text;
	var acestreams = document.getElementById('ace');
	text = ""
	for (i = 0; i < aces.length; i+=2) {
		if (aces[i+1] == "") {
			aces[i+1] = "No Data"
		}
		aces[i] = aces[i].replace(/(\r\n|\n|\r)/gm,"");
		text += "<li><div class=\"acecontainer\"><span class=\"desc\">"+aces[i+1]+" </span><span class=\"address\">"+aces[i]+"</span></div><button title=\"Open in SodaPlayer\" class=\"sodaplayer\" onclick=\"openAce('"+aces[i]+"')\"></button></li>"
	}
	acestreams.innerHTML = text;
}
function openAce(acelink) {
	try {window.location.href = "sodaplayer://?url=" + acelink}
	catch {alert('Error opening SodaPlayer')}
}
function copy(that){
	var inp = document.createElement('input');
	document.body.appendChild(inp)
	inp.value = that.textContent
	inp.select();
	document.execCommand('copy',false);
	inp.remove();
}