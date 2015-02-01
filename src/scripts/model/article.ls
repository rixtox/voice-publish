App = require '../app.ls'
{Parse, Config} = App

Article = Parse.Object.extend do
  Config.Model.Article
  defaults:
    title: 'Untitled'

  initialize: ->
    unless @get 'title'
      @set title: @defaults.title

module.exports = Article
