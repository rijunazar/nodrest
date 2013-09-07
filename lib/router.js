'use strict';

var utils = require('utils'),
    url = require('url')


function pathToRegEx (path) {
    var regX,
        pattern = '^',
        params = [];
    
    if (path instanceof RegExp) {
            regX = path;
    } else {

        path.split('/').forEach(function (fragment) {
           if (fragment.length > 0) {
               pattern += '\\/+';
               //TODO: add support for types
               if (fragment.charAt(0) === ':') {
                   pattern += '([a-zA-Z0-9-_~\\.%]+)';
                   params.push(fragment.slice(1));
               } else {
                   pattern += fragment;
               }
           }
        });

        if (pattern !== '^') {
            pattern += '/?$';
        } else {
            pattern += '\\/';
        }
        regX = new RegExp(pattern);
        regX._params = params;
    }
    return regX; 
}

function Router () {
    var oThis = this;
    
    oThis.routes = Object.create(null);
}

// ToDo: Use Object.defineProperties and getters

Router.prototype = {
    bind: function (path, callback, context) {
        var oThis = this;
        
        oThis.routes[path] = {
            regEx: pathToRegEx(path),
            callback: context ? callback.bind(context) : callback
        }
    },
    
    unbind: function (path) {
        delete this.routes[path];
    },
    
    route: function (req) {
        var oThis = this,
            routes = oThis.routes,
            keys = Object.keys(routes),
            url = req.path,
            route,
            params,
            length,
            i;
            
        for (i = 0, length = keys.length; i < length; i++) {
            route = routes[keys[i]];
            params = oThis._match(route.regEx, url);
            if (params) {
                route.callback(params);
                break;
            }
        }
    },
    
    _match: function (regX, path) {
        var urlParts = regX._params,
            matches = regX.exec(path),
            i = 0,
            length,
            params;

        if (matches) {
            params = {};
            length = matches.length;

            if (!urlParts) {
                for (i = 1; i < length; i++) {
                    params[i - 1] = matches[i];
                }
            }

            if (urlParts && urlParts.length > 0) {
               urlParts.forEach(function (part) {
                  if (++i < length) {
                      params[part] = decodeURIComponent(matches[i]);
                  }
               });
            }
        }

        return params;
    }
}
