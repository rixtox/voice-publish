require! 'url'
Q = require 'q'

loadedScripts = []

Util =
  transformUrl: (uri) ->
    uri = url.parse uri
    if location.protocol is 'file:' and !uri.protocol
      uri.protocol = 'http:'
    url.format uri

  loadScript: (src) ->
    if src in loadedScripts
      return Q!
    loadedScripts.push src
    deferred = Q.defer!
    src = Util.transformUrl src
    script = document.createElement 'script'
    script.setAttribute 'type', 'text/javascript'
    script.setAttribute 'src', src
    script.onload = deferred.resolve
    script.onreadystatechange = ->
      if @readyState is 'complete'
        deferred.resolve!
    script |> document.getElementsByTagName("head")[0].appendChild
    deferred.promise

  formatDate: require './format-date.js'
    

module.exports = Util
