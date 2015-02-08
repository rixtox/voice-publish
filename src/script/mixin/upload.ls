require! 'path'
Q = require 'q'
{Parse} = require 'parse'

Upload =
  uploadImages: (inputFiles) ->
    @uploadFiles inputFiles, /^image\/.+/

  uploadFiles: (inputFiles, MIMERegex = /.*/) ->
    files = for i in [0 to inputFiles.length - 1]
      inputFiles[i]
    Q.all do
      files.filter (.type.match MIMERegex)
      .map (imageFile) ->
        fileName = do
          (new Date)
          .toJSON!
          .replace /\..*$/, ''
          .replace /[T:]/g, '-'
        fileName += path.extname imageFile.name
        parseFile = new Parse.File fileName, imageFile
        parseFile.save!

module.exports = Upload
