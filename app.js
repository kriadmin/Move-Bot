#!/usr/bin/env node
var Regex, colors, filePath, fs, mv, walk, yesno;

fs = require("fs");

walk = require('walk');

Regex = require('regex');

colors = require('colors');

yesno = require('yesno');

mv = require('mv');

filePath = process.argv[2];

console.log(("Running from " + filePath).underline);

fs.stat(filePath, function (err, stats) {
	if (!err && stats.isFile()) {
		console.log('Found file');
		console.log('Trying to read file'.underline);
		return fs.readFile(filePath, 'utf8', function (err, data) {
			var files, schema, walker;
			console.log('Read file successfully.');
			console.log('Trying to parse JSON'.underline);
			schema = JSON.parse(data);
			console.log('Parsed JSON successfully');
			if (schema.__ELSE__) {
				console.log('Compiling list of current files'.underline);
				files = {};
				walker = walk.walk('.', {
					followLinks: false
				});
				walker.on('file', function (root, stat, next) {
					console.log("Found " + root + " / " + stat.name);
					files[stat.name] = "" + root + "/" + stat.name;
					return next();
				});
				return walker.on('end', function () {
					console.log('Creating .movebot'.underline);
					return fs.mkdir('./.movebot', function (err) {
						var file, key, name, newFiles, path, regex, val;
						console.log('Done');
						console.log('Flattening into .movebot'.underline);
						for (name in files) {
							path = files[name];
							fs.renameSync(path, "./.movebot/" + name);
							console.log("Moved " + name);
						}
						console.log('Making organisation proposal'.underline);
						newFiles = {};
						for (key in schema) {
							val = schema[key];
							regex = new Regex(key);
							for (file in files) {
								path = files[file];
								if (regex.test(file)) {
									console.log("" + file + " matches " + regex);
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
						console.log(newFiles);
						console.log('TODO : Print out organisation proposal properly'.red);
						return yesno.ask('Apply this organisation proposal?'.underline, false, function (ok) {
							var _results;
							if (ok) {
								console.log('LETS DO THIS!'.underline.green);
								console.log('Removing directories'.underline);
								console.log('Applying organisation proposal'.underline);
								_results = [];
								for (key in newFiles) {
									val = newFiles[key];
									console.log("Moving " + key + " to " + val);
									_results.push(mv("./.movebot/" + key, val, {
										mkdirp: true
									}, function (err) {
										if (err) {
											throw new Error(("Failed to move files : " + err).underline.red);
										} else {
											return console.log(("Moved " + key + " to " + val).green);
										}
									}));
								}
								return _results;
							} else {
								console.log('Oh well, Thank you for using movebot'.underline.red);
								return process.exit();
							}
						});
					});
				});
			} else {
				throw new Error('Not a valid Schema : Missing an __ELSE__ key'.underline.bold.red);
			}
		});
	} else {
		throw new Error('Couldn\'t find file');
	}
});

console.log('Trying to find file'.underline);

//# sourceMappingURL=app.js.map
