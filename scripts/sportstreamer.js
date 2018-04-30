
var getUrl = window.location;
var baseUrl = getUrl .protocol + "//" + getUrl.host + "/" //+ getUrl.pathname.split('/')[1];
var forum = "";
var game = "";
//Sport Buttons
var sports_list = ["Soccer", "NFL", "NBA", "NCAA FB", "NCAA BB", "MLB", "NHL", "Golf", "Cricket", "MMA"];
var addresses = ["https://www.reddit.com/r/soccerstreams/", "https://www.reddit.com/r/nflstreams/", "https://www.reddit.com/r/nbastreams/", "https://www.reddit.com/r/CFBStreams/", "https://www.reddit.com/r/ncaaBBallStreams/", "https://www.reddit.com/r/MLBStreams/", "https://www.reddit.com/r/NHLStreams/", "https://www.reddit.com/r/PuttStreams/", "https://www.reddit.com/r/cricket_streams/", "https://www.reddit.com/r/MMAStreams/"]
var sports = document.getElementById('sports');
var text = "";
for (i = 0; i < sports_list.length; i++) {
	text += "<li><button class=\"sports\" onclick='getGames(\"" + addresses[i] + "\")'>" + sports_list[i] + "</button></li>"
}
sports.innerHTML = text;

function makeRedditLink(link) {
	var newLink = link.slice(baseUrl.length);
	var finalLink = "https://www.reddit.com/" + newLink;
	return finalLink;
}

function makeHttpObject() {
  try {return new XMLHttpRequest();}
  catch (error) {}
  try {return new ActiveXObject("Msxml2.XMLHTTP");}
  catch (error) {}
  try {return new ActiveXObject("Microsoft.XMLHTTP");}
  catch (error) {}

  throw new Error("Could not create HTTP request object.");
}
var request = makeHttpObject();

function getGames(url) {
	forum = url
	var links = document.getElementById('web');
	links.innerHTML = ""
	var aces = document.getElementById('ace');
	aces.innerHTML = "";
	var games = document.getElementById('games');
	text = "<center>...Getting Games...</center>"
	games.innerHTML = text
	request.open("GET", url, true);
	request.send(null);
	request.onreadystatechange = function() {
		if (request.readyState == 4){
			//alert('HTML ACQUIRED');
			parseGames(request.responseText);
		}
	};
}
function parseGames(html) {
	var rawHTML = html
	var doc = document.createElement("html");
	doc.innerHTML = rawHTML;
	var links = doc.getElementsByClassName('title may-blank')
	var urls = [];
	//alert(links.length);
	for (var i=0, max=links.length; i<max; i++) {
		if (/\d/.test(links[i].text)){
    		urls.push(makeRedditLink(links[i].href));
    		urls.push(links[i].text)
    	}
	}
	makeGameButtons(urls);
}
function makeGameButtons(urls) {
	var games = document.getElementById('games');
	text = ""
	for (i = 0; i < urls.length; i += 2) {
		text += "<li><button onclick='getLinks(\""+ urls[i] +"\")' style=\"height:30px;\">" + urls[i+1] + "</button></li>"
	}
	if (text == "") {
		text = "<center><li><b>No Games Found? Try these:</b></li>\n" + 
				"<li>Make sure <a style=\"color:black;\"href=\"https://chrome.google.com/webstore/detail/allow-control-allow-origi/nlfbmbojpeacfghkpbjhddihlkkiljbi/related?hl=en-US\"><u>extension</u></a> is installed and <b>ON</b></li>" +
		        "<li>Click the button again</li>" +
		        "<li>Make sure games are scheduled</li>"+
		        "<li><a style=\"color:black;\" href=\""+ forum +"\"><u>Go to forum</u></a></li></center>"
	}
	games.innerHTML = text;
}
function getLinks(url){
	game = url;
	var links = document.getElementById('web');
	text = "<center>...Getting Links...</center>"
	links.innerHTML = text
	request.open("GET", url, true);
	request.send(null);
	request.onreadystatechange = function() {
		if (request.readyState == 4){
    		//alert('HTML ACQUIRED');
    		parseLinks(request.responseText);
    	}
    };
}
function acestreams(htmlDoc) {
	var possible = htmlDoc.getElementsByTagName('code')
	var acestreams = new Array()
	var re = /\bacestream:\/\/[-a-zA-Z0-9]*/g 
	for (var i=0; i < possible.length; i++) {
		acestreams.push(possible[i].innerHTML)
	}
	possible = htmlDoc.getElementsByTagName('p')
	for (var i=0; i < possible.length; i++) {
		if (re.test(possible[i].innerHTML)) {
			acestreams.push(re.exec(possible[i].innerHTML))
		}
	}
	console.log(acestreams)
	return acestreams
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
	console.log(urls.length)
	makeLinkButtons(urls, acestreams(doc));
}
function makeLinkButtons(urls, aces) {
	var links = document.getElementById('web');
	text = ""
	for (i = 0; i < urls.length; i++) {
		text += "<li><a href=\""+ urls[i] +"\" target=\"_blank\"><button>" + urls[i] + "</button></a></li>"
	}
	if (text == "") {
		text = "<center><li><b>No Links Found? Try these:</b></li>\n" + 
		        "<li>Click the button again</li>" +
		        "<li>Make sure games are scheduled</li>"+
		        "<li><a style=\"color:black;\" href=\""+ game +"\"><u>Go to post</u></a></li></center>"
	}
	links.innerHTML = text;
	var acestreams = document.getElementById('ace');
	text = ""
	for (i = 0; i < aces.length; i++) {
		text += "<li style=\"background-color:#E6E6E6\">" + aces[i] + "</li>"
		//text += "<li><button onclick='openAce(\""+aces[i]+"\")'>" + aces[i] + "</button></li>"
	}
	acestreams.innerHTML = text;
}
function openAce(acelink) {
	try {window.open("sodaplayer://?url=" + acelink)}
	catch {alert('copied to clipboard')}
	
}