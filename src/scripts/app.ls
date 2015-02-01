React = require 'react'
{Parse} = require 'parse'
$ = Parse.$ = require 'jquery'
config = require '../../config.ls'

Parse.initialize do
  config.Parse['Application ID']
  config.Parse['JavaScript Key']

module.exports = App = {Parse, config}

$ ->
  React.render do
    React.createElement do
      require './app-view.jsx'
    document.body
