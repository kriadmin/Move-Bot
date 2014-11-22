fs = require "fs"
walk = require 'walk'
Regex = require 'regex'
colors = require 'colors'
filePath = process.argv[2]
console.log "Running from #{filePath}".underline
fs.stat filePath, (err, stats) ->
	if !err and stats.isFile()
		console.log 'Found file'
		console.log 'Trying to read file'.underline
		fs.readFile filePath, 'utf8', (err, data) ->
			console.log 'Read file successfully.'
			console.log 'Trying to parse JSON'.underline
			schema = JSON.parse(data)
			console.log 'Parsed JSON successfully'
			if schema.__ELSE__
				console.log 'Compiling list of current files'.underline
				files = []
				walker = walk.walk './', {followLinks: false}
				walker.on 'file', (root, stat, next) ->
					console.log "Found #{root}{stat.name}"
					files.push "#{root}{stat.name}"
					next()
				walker.on 'end', ->
					console.log 'Organising'.underline
					newFiles = []
					for key, val of schema
						regex = new Regex key
						for file in files
							if regex.test file
								newFiles.push "#{val}/#{file}"
								files.splice files.indexOf(file), 1 if files.indexOf(file) > -1
					for file in files
						newFiles.push "#{schema.__ELSE__}/#{file}"
						files.splice files.indexOf(file), 1 if files.indexOf(file) > -1
					console.log 'TODO : Print out new organisation.'.red
			else
				throw new Error 'Not a valid Schema : Missing an __ELSE__ key'.underline.bold.red
	else
		throw new Error 'Couldn\'t find file'
console.log 'Trying to find file'.underline
