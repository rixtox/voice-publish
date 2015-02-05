App = require '../app.ls'
{Parse, Config} = App

Session = Parse.Object.extend do
  Config.Model.Session
  defaults:
    isPublished: false

  initialize: ->
    unless @get('isPublished')?
      @set isPublished: @defaults.isPublished

module.exports = Session
