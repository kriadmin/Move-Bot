var Regex, colors, filePath, fs, mv, walk;

fs = require("fs");

mv = require('mv');

walk = require('walk');

Regex = require('regex');

colors = require('colors');

filePath = process.argv[2];

console.log(("Running from " + filePath).underline);

fs.stat(filePath, function(err, stats) {
  if (!err && stats.isFile()) {
    console.log('Found file');
    console.log('Trying to read file'.underline);
    return fs.readFile(filePath, 'utf8', function(err, data) {
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
        walker.on('file', function(root, stat, next) {
          console.log("Found " + root + "/" + stat.name);
          files[stat.name] = "" + root + "/" + stat.name;
          return next();
        });
        return walker.on('end', function() {
          var file, key, newFiles, path, regex, val, _i, _len;
          console.log('Creating .movebot'.underline);
          fs.mkdir('./.movebot', function(err) {
            var name, path, _results;
            console.log('Flattening into .movebot'.underline);
            _results = [];
            for (name in files) {
              path = files[name];
              _results.push(mv(path, "./.movebot/" + name, function(err) {
                if (err) {
                  throw new Error('Failed to move files'.underline.red);
                } else {
                  return console.log("Moved " + path + " to .movebot/" + name);
                }
              }));
            }
            return _results;
          });
          console.log('Making organisation proposal'.underline);
          newFiles = [];
          for (key in schema) {
            val = schema[key];
            regex = new Regex(key);
            for (file in files) {
              path = files[file];
              if (regex.test(file)) {
                newFiles.push("" + val + "/" + file);
              }
            }
          }
          for (_i = 0, _len = files.length; _i < _len; _i++) {
            file = files[_i];
            newFiles.push("" + schema.__ELSE__ + "/" + file);
          }
          return console.log('TODO : Print out organisation proposal properly'.red);
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
