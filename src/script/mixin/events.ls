Q = require 'q'

Events =
  preventDefault: (event) ->
    event.preventDefault!

  parseInput: (input) ->
    self = this
    upload = (input) ->
      if input.multiple
        self.uploadFiles input.files
      else
        self.uploadFile input.files
    Q do ->
      switch input.type
        | 'text'     => input.value
        | 'url'      => input.value
        | 'password' => input.value
        | 'checkbox' => input.checked
        | 'number'   => parseInt input.value
        | 'file'     => upload input

  onFormChange: (data, key) -->
    (event) ->
      {target} = event
      key = target.id
      Events.parseInput target
      .then (|> data.set key, _)

  showMessage: (message) ->
    @setState message: (new Date).toLocaleTimeString! + ': ' + message

module.exports = Events
