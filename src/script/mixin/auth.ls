{Parse} = require 'parse'

Auth =
  getUser: ->
    Parse.User.current!

  statics:
    willTransitionTo: (transition) ->
      unless Parse.User.current!
        LoginView = require '../view/login.jsx'
        LoginView.attemptedTransition = transition
        transition.redirect '/login'

module.exports = Auth
