require! 'path'
Q = require 'q'
{Parse} = require 'parse'

Upload =
  uploadFile: (inputFiles) ->
    Upload.uploadFiles inputFiles
    .then (.[0])

  uploadFiles: (inputFiles) ->
    files = for i in [0 to inputFiles.length - 1]
      inputFiles[i]
    Q.all files.map (imageFile) ->
      fileName = do
        (new Date)
        .toJSON!
        .replace /\..*$/, ''
        .replace /[T:]/g, '-'
      fileName += path.extname imageFile.name
      parseFile = new Parse.File fileName, imageFile
      parseFile.save!

module.exports = Upload
