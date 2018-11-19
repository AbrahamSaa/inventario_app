var express = require('express'),
app = express();

app.use(express.static(__dirname));

app.all('/*', function(req, res, next) {
  // Just send the index.html for other files to support HTML5Mode
  res.sendFile('index.html', { root: __dirname });
});

var server = app.listen(process.env.PORT || 4200);