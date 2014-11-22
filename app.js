#!/usr/bin/env node

var colors, filePath, fs, mv, rimraf, util, walk, yesno;

fs = require("fs");

walk = require('walk');

colors = require('colors');

yesno = require('yesno');

mv = require('mv');

rimraf = require('rimraf');

util = require('util');

filePath = process.argv[2];

if (!filePath) {
	throw new Error('No schema file passed'.underline.red);
}

console.log(("Running from " + filePath).underline);

fs.stat(filePath, function (err, stats) {
	if (!err && stats.isFile()) {
		console.log('Found file');
		console.log('Trying to read file'.underline);
		return fs.readFile(filePath, 'utf8', function (err, data) {
			var originalFiles, schema, walker;
			console.log('Read file successfully.');
			console.log('Trying to parse JSON'.underline);
			schema = JSON.parse(data);
			console.log('Parsed JSON successfully');
			if (schema.__ELSE__) {
				console.log('Compiling list of current files'.underline);
				originalFiles = {};
				walker = walk.walk('.', {
					followLinks: false
				});
				walker.on('file', function (root, stat, next) {
					console.log("Found " + root + " / " + stat.name);
					iles[stat.name] = "" + root + "/" + stat.name;
					return next();
				});
				return walker.on('end', function () {
					var file, files, key, newFiles, path, regex, val;
					console.log('Making organisation proposal'.underline);
					newFiles = {};
					files = JSON.parse(JSON.stringify(originalFiles));
					for (key in schema) {
						val = schema[key];
						regex = new RegExp(key);
						console.log("Trying to match files to " + regex.source);
						for (file in files) {
							path = files[file];
							if (regex.test(file)) {
								console.log("" + file + " matches " + regex.source);
								newFiles[file] = "" + val + "/" + file;
								delete files[file];
							}
						}
					}
					for (file in files) {
						console.log("No matches for " + file + ", Using __ELSE__");
						newFiles[file] = "" + schema.__ELSE__ + "/" + file;
						delete files[file];
					}
					console.log('Please Review The Organisation Proposal'.underline.bgWhite.black);
					console.log(util.inspect(newFiles, {
						showHidden: true,
						depth: null,
						colors: true
					}));
					return yesno.ask('Apply this organisation proposal?'.underline, false, function (ok) {
						if (ok) {
							console.log('LETS DO THIS!'.underline.green);
							console.log('Creating .movebot'.underline);
							return fs.mkdir('./.movebot', function (err) {
								var name, _results;
								console.log('Done');
								console.log('Flattening into .movebot'.underline);
								for (name in originalFiles) {
									path = originalFiles[name];
									fs.renameSync(path, "./.movebot/" + name);
									console.log("Moved " + name);
								}
								console.log('Applying organisation proposal'.underline);
								_results = [];
								for (key in newFiles) {
									val = newFiles[key];
									console.log("" + key + " ---> " + val);
									mv("./.movebot/" + key, val, {
										mkdirp: true
									}, function (err) {
										if (err) {
											throw new Error(("Failed to move files : " + err).underline.red);
										}
									});
									_results.push(console.log("Thank you for using movebot".underline.green));
								}
								return _results;
							});
						} else {
							console.log('Oh well, Thank you for using movebot'.underline.red);
							return process.exit();
						}
					});
				});
			} else {
				throw new Error('Not a valid Schema : Missing an __ELSE__ key'.underline.bold.red);
			}
		});
	} else {
		throw new Error('Couldn\'t find file'.underline.red);
	}
});

console.log('Trying to find file'.underline);

//# sourceMappingURL=app.js.map
