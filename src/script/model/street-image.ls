App = require '../app.ls'
{Parse, Config} = App

StreetImage = Parse.Object.extend do
  Config.Model.StreetImage

module.exports = StreetImage
