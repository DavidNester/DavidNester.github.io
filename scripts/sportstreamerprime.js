var getUrl = window.location;
var baseUrl = getUrl .protocol + "//" + getUrl.host + "/" //+ getUrl.pathname.split('/')[1];
var forum = "";
var game = "";
//Sport Buttons
var sports_list = ["Soccer", "NFL", "NBA", "NCAA FB", "NCAA BB", "MLB", "NHL", "Golf", "Cricket", "MMA"];
var addresses = ["https://old.reddit.com/r/soccerstreams/", "https://old.reddit.com/r/nflstreams/", "https://old.reddit.com/r/nbastreams/", "https://old.reddit.com/r/CFBStreams/", "https://old.reddit.com/r/ncaaBBallStreams/", "https://old.reddit.com/r/MLBStreams/", "https://old.reddit.com/r/NHLStreams/", "https://old.reddit.com/r/PuttStreams/", "https://old.reddit.com/r/cricket_streams/", "https://old.reddit.com/r/MMAStreams/"]
var norm_addresses = ["https://www.reddit.com/r/soccerstreams/", "https://www.reddit.com/r/nflstreams/", "https://www.reddit.com/r/nbastreams/", "https://www.reddit.com/r/CFBStreams/", "https://www.reddit.com/r/ncaaBBallStreams/", "https://www.reddit.com/r/MLBStreams/", "https://www.reddit.com/r/NHLStreams/", "https://www.reddit.com/r/PuttStreams/", "https://www.reddit.com/r/cricket_streams/", "https://www.reddit.com/r/MMAStreams/"]
var sports = document.getElementById('sports');
var text = "";
for (i = 0; i < sports_list.length; i++) {
	text += "<li><button class=\"sports\" onclick='getGames(\"" + addresses[i] + "\")'>" + sports_list[i] + "</button></li>"
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
request.onerror = function() {alert("Make sure extension is installed and ON")}

function getGames(url) {
	//scrapes games from forum page
	//makes naive assumption that games have number in post title
	forum = url
	//quick dumb fix
	url = "https://cors-anywhere.herokuapp.com/" + url;
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
	//parses html from forum page
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
	//makes game buttons from results of scraping
	var games = document.getElementById('games');
	text = ""
	for (i = 0; i < urls.length; i += 2) {
		text += "<li><button onclick='getLinks(\""+ urls[i] +"\")' style=\"height:40px;\">" + urls[i+1] + "</button></li>"
	}
	if (text == "") {
		text = "<center><li><b>No Games Found?</b></li>\n" + 
		        "<li>Make sure games are scheduled</li>"+
		        "<li><a target= \"_blank\" style=\"color:black;\" href=\""+ forum +"\"><u>Go to forum</u></a></li></center>"
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
		text += "<li><button onclick='getVideo(\""+urls[i]+"\")'>" + urls[i] + "</button></li>"
	}
	if (text == "") {
		text = "<center><li><b>No Links Found</b></li>\n" + 
		        "<li><a target= \"_blank\" style=\"color:black;\" href=\""+ forum +"\"><u>Go to forum</u></a></li></center>"
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
function getVideo(url) {
	//url = "http://grandmastreams.live/f/btn.php"
	//get the video src
	url = "https://cors-anywhere.herokuapp.com/" + url;
	request.open("GET", url, true);
	request.send(null);
	request.onreadystatechange = function() {
		if (request.readyState == 4){
    		getIFrame(request.responseText);
    	}
    };
}
function getIFrame(html) {
    var doc = document.createElement("html");
	doc.innerHTML = html
	var possible = doc.getElementsByTagName('iframe');
	console.log(possible);
	var src = possible[0].src;
	//for (var i=0, max=possible.length; i<max; i++) {
	//	src = possible[i].src;
	//}
    //open player
	var container = document.getElementById('video-holder');
	var video = document.getElementById('video');
	video.src = src;
	container.style.display = "block";
}
function copy(that){
	var inp = document.createElement('input');
	document.body.appendChild(inp)
	inp.value = that.textContent
	inp.select();
	document.execCommand('copy',false);
	inp.remove();
}