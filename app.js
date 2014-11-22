var Regex, colors, filePath, fs, walk;

fs = require("fs");

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
        files = [];
        walker = walk.walk('./', {
          followLinks: false
        });
        walker.on('file', function(root, stat, next) {
          console.log("Found " + stat.name);
          files.push(stat.name);
          return next();
        });
        return walker.on('end', function() {
          var file, key, newFiles, regex, val, _i, _j, _len, _len1;
          console.log('Organising'.underline);
          newFiles = [];
          for (key in schema) {
            val = schema[key];
            regex = new Regex(key);
            for (_i = 0, _len = files.length; _i < _len; _i++) {
              file = files[_i];
              if (regex.test(file)) {
                newFiles.push("" + val + "/" + file);
                if (files.indexOf(file) > -1) {
                  files.splice(files.indexOf(file), 1);
                }
              }
            }
          }
          for (_j = 0, _len1 = files.length; _j < _len1; _j++) {
            file = files[_j];
            newFiles.push("" + schema.__ELSE__ + "/" + file);
            if (files.indexOf(file) > -1) {
              files.splice(files.indexOf(file), 1);
            }
          }
          return console.log('TODO : Print out new organisation.'.red);
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
