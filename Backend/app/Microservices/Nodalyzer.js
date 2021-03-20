var nodalyzer = require('nodalyzer');

nodalyzer.init(function (status) {
    if (!status) { return; }
    nodalyzer.get('http://www.github.com/', function (err, response) {
        if (err) { throw err; }
        response.apps.forEach(function (app) {
            console.log(app);
        });
    });
    nodalyzer.close();
});