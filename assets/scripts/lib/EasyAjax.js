define(["JS"], function(JS) {
  var EasyAjax = function() {
    var _request = null,
      _callback = null,
      _errorback = null,
      _data = "";

    /**
     * Creates new XMLHttpRequest and sets Defaults by method
     *
     * @param method
     * @param url
     * @param data
     * @constructor
     */
    function Request(method, url, data) {
      method = method.toUpperCase();
      _request = new XMLHttpRequest();
      _request.open(method, url, true);
      _data = data;

      if (method === "POST") {
        this.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
      }

      _request.onload = function() {
        if (_request.status >= 200 && _request.status < 400) {
          var data = null;
          if (method === "JSON") {
            data = JSON.parse(_request.responseText);
          } else {
            data = _request.responseText;
          }

          if (typeof _callback === "function") {
            _callback(data);
          }

        } else {
          if (typeof _errorback === "function") {
            _errorback(_request.status);
          }
        }
      }
    }

    Request.prototype = {
      /**
       * Sets Header of Request
       * @param header
       * @param value
       * @chainable
       * @returns {Request}
       */
      setRequestHeader: function(header, value) {
        _request.setRequestHeader(header, value);
        return this;
      },

      /**
       * Sets Callback for successful ajax-request
       * @param callback
       * @returns {Request}
       */
      setCallback: function(callback) {
        if (typeof callback === "function") {
          _callback = callback;
        }
        return this;
      },

      /**
       * Sets Errorback for failed ajax-request
       * @param errorback
       * @returns {Request}
       */
      setErrorback: function(errorback) {
        if (typeof errorback === "function") {
          _request.onerror = errorback;
        }
        return this;
      },

      /**
       * Sets the data sent by the request
       * @param data
       * @returns {Request}
       */
      setData: function(data) {
        _data = data;
        return this;
      },

      /**
       * Triggers Request to send
       */
      send: function() {
        _request.send(_data);
      }
    };

    return JS.getCreater().createInstance(Request, arguments);
  };

  return {
    get: function(url, data) {
      return new EasyAjax("get", url, data);
    },
    post: function(url, data) {
      return new EasyAjax("post", url, data);
    },
    json: function(url, data) {
      return new EasyAjax("json", url, data);
    }
  }
});