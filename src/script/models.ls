{Parse} = require 'parse'
{Config} = require './app.ls'

Models = {}

for k, v of Config.Model
  Models[k] = Parse.Object.extend v
  Models[k].modelName = v

module.exports = Models
