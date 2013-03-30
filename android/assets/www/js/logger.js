define([], function() {
	function errorHandler(e) {
		var msg = '';
		
		switch (e.code) {
			case window.FileError.QUOTA_EXCEEDED_ERR:
				msg = 'QUOTA_EXCEEDED_ERR';
				break;
			case window.FileError.NOT_FOUND_ERR:
				msg = 'NOT_FOUND_ERR';
				break;
			case window.FileError.SECURITY_ERR:
				msg = 'SECURITY_ERR';
				break;
			case window.FileError.INVALID_MODIFICATION_ERR:
				msg = 'INVALID_MODIFICATION_ERR';
				break;
			case window.FileError.INVALID_STATE_ERR:
				msg = 'INVALID_STATE_ERR';
				break;
			default:
				msg = 'Unknown Error';
				break;
		}
		
		console.log('Error: ' + msg);
	}
	
	function createDir(rootDirEntry, folders, successCallback) {
		// Throw out './' or '/' and move on to prevent something
		// like '/foo/.//bar'.
		if (folders[0] === '.' || folders[0] === '') {
			folders = folders.slice(1);
		}
		
		rootDirEntry.getDirectory(folders[0], {create: true}, function(dirEntry) {
			// Recursively add the new subfolder (if we still have
			// another to create).
			if (folders.length > 1) {
				createDir(dirEntry, folders.slice(1), successCallback);
			} else {
				successCallback(dirEntry);
			}
		}, errorHandler);
	}
	
	var Logger = function(rootDirectory) {
		this.rootDirectory = rootDirectory;
		this.filename = 'default';
		this.files = {};                    
	};
	
	Logger.prototype.prepare = function(fs, callback) {
		var self = this;
		
		createDir(fs.root, self.rootDirectory.split('/'), function(dir) {
			var dirReader = dir.createReader();
			
			var readEntries = function() {
				dirReader.readEntries (function(files) {
					if (files.length) {
						Array.prototype.forEach.call(files, function(file) {
							var parts,
								filename,
								number;
							
							console.log(file.name);
							if (/(.*)-(\d+)\.txt$/.test(file.name)) {
								parts = file.name.match(/(.*)-(\d+)\.txt$/);
								filename = parts[1];
								number = parseInt(parts[2], 10);
								
								if (self.files.hasOwnProperty(filename)) {
									if (number > self.files[filename]) {
										self.files[filename] = number;
									}
								} else {
									self.files[filename] = number;
								}
								
								file.getMetadata(function(metadata) {
									if (!self.lastUsed || self.lastUsed.getTime() < metadata.modificationTime.getTime()) {
										self.lastUsed = metadata.modificationTime;
										self.filename = filename;
									}
								});
							}
						});
						readEntries();
					} else {
						callback(self.filename);
					}
				}, errorHandler);
			};
			
			readEntries();
		});
	};
	
	Logger.prototype.write = function(writer) {
		var self = this;
		var filename = self.filename;
		var number; 
		if (self.files.hasOwnProperty(filename)) {
			number = self.files[filename] + 1;
		} else {
			number = 0;
		}
		
		self.files[filename] = number;
		var fullName = filename + '-' + number + '.txt';
		
		window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fs) {
			fs.root.getFile(self.rootDirectory + '/' + fullName, {create: true}, function(fileEntry) {
				writer(fileEntry);
			});              
		});
	};
	
	Logger.prototype.changeFile = function(filename) {
		if (filename && filename.trim() !== "") {
			this.filename = filename;
		}
	};
	
	return Logger;
});