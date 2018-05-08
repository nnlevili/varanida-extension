/*******************************************************************************

    Varanida - a browser extension to block requests.
    –– data wallet component ––
    Silto (2018)

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see {http://www.gnu.org/licenses/}.

    Home: https://github.com/Varanida/varanida-extension
*/

const blake = require('blakejs');

const µDataWallet = (function() {
  return {
    dataSettings: {
      dataShareLevel: 0,
      dataCompletionLevel: 0,
      dataTrackingWhitelistString: "",
    },
    tempData: {},
    dataTrackingWhitelist: {},
    stringFromWhitelist: function(){},
    whitelistFromString: function(){},
    URI: null,
  };
})();

/* settings handling */

µDataWallet.saveSettings = function(callback) {
    vAPI.storage.set(this.dataSettings, callback);
};

µDataWallet.updateSettings = function(updates, callback) {
  if (!updates) {
    return;
  }
  const updateKeys = Object.keys(updates);
  let hasUpdates = false;
  updateKeys.forEach(key => {
    this.dataSettings[key] = updates[key];
    hasUpdates = true;
  });
  if (hasUpdates) {
    this.saveSettings(callback);
  } else {
    callback && callback();
  }
};

µDataWallet.saveWhitelist = function(callback) {
    const newWhitelistString = this.stringFromWhitelist(this.dataTrackingWhitelist);
    this.updateSettings({
      dataTrackingWhitelistString: newWhitelistString
    }, callback);
};

/* initialization routine, executed at extension startup */

µDataWallet.init = function() {
  this.URI = µBlock.URI;
  this.stringFromWhitelist = µBlock.stringFromWhitelist;
  this.whitelistFromString = µBlock.whitelistFromString;
  this.loadDataWhitelist();
}

µDataWallet.loadDataWhitelist = function() {
  if (!this.dataTrackingWhitelistString) {
    this.dataTrackingWhitelist = "";
  }
  this.dataTrackingWhitelist = this.whitelistFromString(this.dataTrackingWhitelistString);
};

/* whitelist utilities */

// TODO since this code is shared with ublock.js, move to a util file

// Any special regexp char will be escaped
const whitelistDirectiveEscape = /[-\/\\^$+?.()|[\]{}]/g;

// All `*` will be expanded into `.*`
const whitelistDirectiveEscapeAsterisk = /\*/g;

let directiveToRegexpMap = new Map();

// Probably manually entered whitelist directive
var isHandcraftedWhitelistDirective = function(directive) {
    return directive.startsWith('/') && directive.endsWith('/') ||
           directive.indexOf('/') !== -1 && directive.indexOf('*') !== -1;
};

const matchDirective = function(url, hostname, directive) { //copied from ublock.js
    // Directive is a plain hostname.
    if ( directive.indexOf('/') === -1 ) {
        return hostname.endsWith(directive) &&
              (hostname.length === directive.length ||
               hostname.charAt(hostname.length - directive.length - 1) === '.');
    }
    // Match URL exactly.
    if ( directive.startsWith('/') === false && directive.indexOf('*') === -1 ) {
        return url === directive;
    }
    // Transpose into a regular expression.
    let re = directiveToRegexpMap.get(directive);
    if ( re === undefined ) {
        let reStr;
        if ( directive.startsWith('/') && directive.endsWith('/') ) {
            reStr = directive.slice(1, -1);
        } else {
            reStr = directive.replace(whitelistDirectiveEscape, '\\$&')
                             .replace(whitelistDirectiveEscapeAsterisk, '.*');
        }
        re = new RegExp(reStr);
        directiveToRegexpMap.set(directive, re);
    }
    return re.test(url);
};

var matchBucket = function(url, hostname, bucket, start) {
    if ( bucket ) {
        for ( let i = start || 0, n = bucket.length; i < n; i++ ) {
            if ( matchDirective(url, hostname, bucket[i]) ) {
                return i;
            }
        }
    }
    return -1;
};

/* external functions, change interface carefully */

µDataWallet.getDataWhitelistSwitch = function(url) {
    var targetHostname = this.URI.hostnameFromURI(url),
        key = targetHostname,
        pos;
    for (;;) {
        if ( matchBucket(url, targetHostname, this.dataTrackingWhitelist[key]) !== -1 ) {
            return false;
        }
        pos = key.indexOf('.');
        if ( pos === -1 ) { break; }
        key = key.slice(pos + 1);
    }
    if ( matchBucket(url, targetHostname, this.dataTrackingWhitelist['//']) !== -1 ) {
        return false;
    }
    return true;
};

µDataWallet.toggleTrackingWhitelist = function(url, scope, newState) {
  var currentState = this.getDataWhitelistSwitch(url);
  if ( newState === undefined ) {
      newState = !currentState;
  }
  if ( newState === currentState ) {
      return currentState;
  }

  var dataTrackingWhitelist = this.dataTrackingWhitelist,
      pos = url.indexOf('#'),
      targetURL = pos !== -1 ? url.slice(0, pos) : url,
      targetHostname = this.URI.hostnameFromURI(targetURL),
      key = targetHostname,
      directive = scope === 'page' ? targetURL : targetHostname;

  // Add to directive list
  if ( newState === false ) {
      if ( dataTrackingWhitelist[key] === undefined ) {
          dataTrackingWhitelist[key] = [];
      }
      dataTrackingWhitelist[key].push(directive);
      this.saveWhitelist();
      return true;
  }

  // Remove from directive list whatever causes current URL to be whitelisted
  var bucket, i;
  for (;;) {
      bucket = dataTrackingWhitelist[key];
      if ( bucket !== undefined ) {
          i = undefined;
          for (;;) {
              i = matchBucket(targetURL, targetHostname, bucket, i);
              if ( i === -1 ) { break; }
              directive = bucket.splice(i, 1)[0];
              if ( isHandcraftedWhitelistDirective(directive) ) {
                  dataTrackingWhitelist['#'].push('# ' + directive);
              }
          }
          if ( bucket.length === 0 ) {
              delete dataTrackingWhitelist[key];
          }
      }
      pos = key.indexOf('.');
      if ( pos === -1 ) { break; }
      key = key.slice(pos + 1);
  }
  bucket = dataTrackingWhitelist['//'];
  if ( bucket !== undefined ) {
      i = undefined;
      for (;;) {
          i = matchBucket(targetURL, targetHostname, bucket, i);
          if ( i === -1 ) { break; }
          directive = bucket.splice(i, 1)[0];
          if ( isHandcraftedWhitelistDirective(directive) ) {
              dataTrackingWhitelist['#'].push('# ' + directive);
          }
      }
      if ( bucket.length === 0 ) {
          delete dataTrackingWhitelist['//'];
      }
  }
  this.saveWhitelist();
  return true;
};

µDataWallet.setShareLevel = function(newShareLevel, callback) {
  this.updateSettings({
    dataShareLevel: newShareLevel
  }, callback);
};

µDataWallet.setUserData = function(newCompletionLevel, data, callback) {
  //TODO check data validity
  this.tempData = data;
  this.updateSettings({
    dataCompletionLevel: newCompletionLevel
  }, callback);
}

µDataWallet.sendUserData = function(password, callback) {
  //TODO encrypt and send data using µWallet
  callback && callback();
}

µDataWallet.getUserData = function(password, callback) {
  //TODO get and decrypt data using µWallet
  let data = {};
  this.tempData = data;
  callback && callback(tempData);
}
