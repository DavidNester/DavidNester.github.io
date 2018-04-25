<script type="text/javascript">
var request = require('request');
var cheerio = require('cheerio');
var url = 'https://www.reddit.com/r/soccerstreams/'
request(url, function(err, resp, body){
  $ = cheerio.load(body);
  links = $('a'); //jquery get all hyperlinks
  $(links).each(function(i, link){
    console.log($(link).text() + ':\n  ' + $(link).attr('href'));
  });
});
function message(text) {
	alert(text);
}

//Sport Buttons
var sports_list = ["Soccer", "NFL", "NBA", "College Football", "College Basketball", "MLB", "NHL"];
var sports = document.getElementById('sports');
var text = "";
for (i = 0; i < sports_list.length; i++) {
	text += "<li><button onclick='message(\""+sports_list[i]+"\")'>" + sports_list[i] + "</button></li>"
}
sports.innerHTML = text;
</script>