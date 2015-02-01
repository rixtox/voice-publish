React = require 'react'
{Parse} = require 'parse'
$ = Parse.$ = require 'jquery'
Config = require '../../config.ls'

Parse.initialize do
  Config.Parse['Application ID']
  Config.Parse['JavaScript Key']

module.exports = App = {Parse, Config}

$ ->
  React.render do
    React.createElement do
      require './view/app.jsx'
    document.body
