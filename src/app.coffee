fs = require "fs"
mv = require 'mv'
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
				files = {}
				walker = walk.walk '.', {followLinks: false}
				walker.on 'file', (root, stat, next) ->
					console.log "Found #{root}/#{stat.name}"
					files[stat.name] = "#{root}/#{stat.name}"
					next()
				walker.on 'end', ->
					console.log 'Creating .movebot'.underline
					fs.mkdir './.movebot', (err) ->
						console.log 'Flattening into .movebot'.underline
						for name,path of files
							mv path, "./.movebot/#{name}", (err) ->
								if err
									throw new Error 'Failed to move files'.underline.red
								else
									console.log "Moved #{path} to .movebot/#{name}"
					console.log 'Making organisation proposal'.underline
					newFiles = []
					for key, val of schema
						regex = new Regex key
						for file,path of files
							if regex.test file
								newFiles.push "#{val}/#{file}"
					for file in files
						newFiles.push "#{schema.__ELSE__}/#{file}"
					console.log 'TODO : Print out organisation proposal properly'.red
			else
				throw new Error 'Not a valid Schema : Missing an __ELSE__ key'.underline.bold.red
	else
		throw new Error 'Couldn\'t find file'
console.log 'Trying to find file'.underline
