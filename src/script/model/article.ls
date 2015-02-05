App = require '../app.ls'
{Parse, Config} = App

Article = Parse.Object.extend do
  Config.Model.Article

module.exports = Article
