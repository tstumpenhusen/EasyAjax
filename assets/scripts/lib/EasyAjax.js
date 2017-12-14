define(["JS"], function(JS) {
  
  /**
   * @type {EasyAjax}
   * @returns {EasyAjax}
   * @constructor
   */
  var EasyAjax = function() {
    var _request = null,
      _callback = null,
      _errorback = null,
      _data = "",
      _requestHeader = {},
      _method;

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
      _method = method;
      _request = new XMLHttpRequest();
      _request.open(method, url, true);
      _data = data;

      this.setRequestHeader("X-Requested-With", "XMLHttpRequest");

      _request.onload = function() {
        if (_request.status >= 200 && _request.status < 400) {
          if (method === "JSON") {
            _request.responseText = JSON.parse(_request.responseText);
          }

          if (typeof _callback === "function") {
            _callback(_request.responseText);
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
       * Adds a Headervalue, which will be added to the Request before send
       * @param header
       * @param value
       * @chainable
       * @returns {EasyAjax}
       */
      setRequestHeader: function(header, value) {
        if (!_requestHeader.hasOwnProperty(header)) {
          _requestHeader[header] = [];
        }
        _requestHeader[header].push(value);
        return this;
      },

      getRequestHeader: function(header) {
        if (!header) {
          return _requestHeader;
        }
        return _requestHeader[header];
      },
      
      /**
       * Sets Callback for successful ajax-request
       * @param callback
       * @returns {EasyAjax}
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
       * @returns {EasyAjax}
       */
      setErrorback: function(errorback) {
        if (typeof errorback === "function") {
          _errorback = errorback;
        }
        return this;
      },

      /**
       * Sets the data sent by the request
       * @param {string} data
       * @returns {EasyAjax}
       */
      setData: function(data) {
        _data = data;
        return this;
      },

      /**
       * Sets the data sent by the request
       * @param {string} data
       * @returns {EasyAjax}
       */
      addData: function(data) {
        if(!!_data && !!data){
          _data += "&";
        }
        
        _data = _data || "";
        _data += data;
        return this;
      },
      
      /**
       * Triggers Request to send
       */
      send: function() {
        if (_method === "POST" && !this.getRequestHeader("Content-Type")) {
          this.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
          this.setRequestHeader("Content-Type", "charset=UTF-8");
        }
        for (var header in _requestHeader) {
          if (_requestHeader.hasOwnProperty(header)
            && Object.prototype.toString.apply(_requestHeader[header]) === "[object Array]") {
            headerValue = _requestHeader[header].join("; ");
            _request.setRequestHeader(header, headerValue);
          }
        }
        try {
          var sendData = _data !== false && _data !== undefined ? _data : null;
          _request.send(sendData);
        }
        catch(e){
          _errorback(e);
        }
      }
    };

    return JS.getCreater().createInstance(Request, arguments);
  };

  return {
    /**
     *
     * @param {string} url
     * @param {string} data
     * @returns {EasyAjax}
     */
    get: function(url, data) {
      return new EasyAjax("get", url, data);
    },
    /**
     *
     * @param {string} url
     * @param {string} data
     * @returns {EasyAjax}
     */
    post: function(url, data) {
      return new EasyAjax("post", url, data);
    },
    /**
     *
     * @param {string} url
     * @param {string} data
     * @returns {EasyAjax}
     */
    json: function(url, data) {
      return new EasyAjax("json", url, data);
    }
  }
});
