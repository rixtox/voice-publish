{Parse} = require '../app.ls'

Session = Parse.Object.extend do
  'Session'
  defaults:
    isPublished: false
    title: 'Untitled Session'

  initialize: ->
    unless @get 'title'
      @set title: @defaults.title
    unless @get('isPublished')?
      @set isPublished: @defaults.isPublished

module.exports = Session
