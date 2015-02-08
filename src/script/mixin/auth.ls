{Parse} = require 'parse'
LoginView = require '../view/login.jsx'

Auth =
  getUser: ->
    Parse.User.current!

  statics:
    willTransitionTo: (transition) ->
      unless Parse.User.current!
        LoginView.attemptedTransition = transition
        transition.redirect '/login'

module.exports = Auth
