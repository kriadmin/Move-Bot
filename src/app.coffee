#!/usr/bin/env node
fs = require "fs"
walk = require 'walk'
colors = require 'colors'
yesno = require 'yesno'
mv = require 'mv'
rimraf = require 'rimraf'
util = require 'util'
filePath = process.argv[2]
throw new Error 'No schema file passed'.underline.red if !filePath
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
				originalFiles = {}
				walker = walk.walk '.', {followLinks: false}
				walker.on 'file', (root, stat, next) ->
					console.log "Found #{root} / #{stat.name}"
					iles[stat.name] = "#{root}/#{stat.name}"
					next()
				walker.on 'end', ->
					console.log 'Making organisation proposal'.underline
					newFiles = {}
					files = JSON.parse JSON.stringify(originalFiles)
					for key, val of schema
						regex = new RegExp(key)
						console.log "Trying to match files to #{regex.source}"
						for file,path of files
							if regex.test file
								console.log "#{file} matches #{regex.source}"
								newFiles[file] = "#{val}/#{file}"
								delete files[file]
					for file of files
						console.log "No matches for #{file}, Using __ELSE__"
						newFiles[file] = "#{schema.__ELSE__}/#{file}"
						delete files[file]
					console.log 'Please Review The Organisation Proposal'.underline.bgWhite.black
					console.log util.inspect(newFiles, {showHidden: true, depth: null, colors: true})
					yesno.ask 'Apply this organisation proposal?'.underline, false, (ok) ->
						if ok
							console.log 'LETS DO THIS!'.underline.green
							console.log 'Creating .movebot'.underline
							fs.mkdir './.movebot', (err) ->
								console.log 'Done'
								console.log 'Flattening into .movebot'.underline
								for name,path of originalFiles
									fs.renameSync path, "./.movebot/#{name}"
									console.log "Moved #{name}"
								console.log 'Applying organisation proposal'.underline
								for key,val of newFiles
									console.log "#{key} ---> #{val}"
									mv "./.movebot/#{key}", val, {mkdirp: true}, (err) ->
										if err
											throw new Error "Failed to move files : #{err}".underline.red
									console.log "Thank you for using movebot".underline.green
						else
							console.log 'Oh well, Thank you for using movebot'.underline.red
							process.exit()
			else
				throw new Error 'Not a valid Schema : Missing an __ELSE__ key'.underline.bold.red
	else
		throw new Error 'Couldn\'t find file'.underline.red
console.log 'Trying to find file'.underline
