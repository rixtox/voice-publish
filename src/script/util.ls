require! 'url'
Q = require 'q'

Util =
  transformUrl: (uri) ->
    uri = url.parse uri
    if location.protocol is 'file:' and !uri.protocol
      uri.protocol = 'http:'
    url.format uri

  loadScript: (src) ->
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

module.exports = Util
