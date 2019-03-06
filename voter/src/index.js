var request = require('request');
var items = ['a','b'];

function vote() { 

  request.post({
    headers: {'content-type' : 'application/x-www-form-urlencoded'},
    url:     'http://web:8001',
    body:    "vote="+items[Math.floor(Math.random()*items.length)]
  }, function(error, response, body){
    //console.log(body);
  });

}


setInterval(vote,500);