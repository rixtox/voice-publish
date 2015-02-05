App = require '../app.ls'
{Parse, Config} = App

StreetDetailImage = Parse.Object.extend do
  Config.Model.StreetDetailImage
  defaults:
    imageHeight: 100

  initialize: ->
    unless @get('imageHeight')?
      @set imageHeight: @defaults.imageHeight

module.exports = StreetDetailImage
