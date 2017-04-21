const Mocha = require('mocha'),
	glob = require('glob'),
	path = require('path');

const mocha = new Mocha();

glob('**/*.test.js', function(err, files) {
	if (err) {
		console.log("Error: ", err);
		return err;
	}

	files.filter(filename => {
 		return !filename.startsWith('node_modules');
 	}).forEach(filename => {
 		mocha.addFile( path.resolve(__dirname + '/../' +filename) );
 	});

 	mocha.run(failures => {
 		process.on('exit', () => {
 			process.exit(failures);
 		});
 	});
 });