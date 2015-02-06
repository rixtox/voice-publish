module.exports = App = {}
React = require 'react'
{Parse} = require 'parse'
App.Parse = Parse
$ = Parse.$ = require 'jquery'
Router = require 'react-router'
App.Config = Config = require '../../config.ls'
App.Util = Util = require './util.ls'
App.Mixin = require './mixin/index.ls'

Parse.initialize do
  Config.Parse['Application ID']
  Config.Parse['JavaScript Key']

require! './routes.jsx'

Util.loadScript Config.CDN.CKEditor
.then -> $ ->
  Router.run routes, (Handler) ->  
    React.render do
      React.createElement Handler
      document.body