# DEVELOPER GUIDE

### Build instructions

- Clone [Varanida](https://github.com/Varanida/varanida-extension) and [Varanida Assets](https://github.com/Varanida/varanida-extension-assets) repositories in the same parent directory
- Set path to the extension's path: `cd varanida-extension-ublock`
- Optional: Select the version to build: `git checkout <tag>` or `git checkout master`
- Build the plugin:
    - Chromium: `./tools/make-chromium.sh` (add `all` to create a ziped version to release it to the chrome store
    - Firefox: `./tools/make-webext.sh all`
- Load the result of the build into your browser:
    - Chromium: load the unpacked extension folder `/varanida-extension-ublock/dist/build/Varanida0.chromium/` in Chromium through chrome://extensions to use the extension.
    - Firefox: drag-and-drop `/varanida-extension-ublock/dist/build/Varanida0.webext.xpi` into Firefox.

#### good to know

The code is mainly divided between cross browser code (in `/varanida-extension-ublock/src/js`)
and code that is specific to browser (in `/platform/<browsername>`).

Some of the code specific to chrome (`/platform/chromium`) is also used for other browsers, and the chromium manifest.json is parsed to integrate version number and other informations in other browser packages.

all code is supposed to be backward compatible pretty far into the past, so only ES5 is accepted. No promises and such, or only browserified.

#### config file

a config file is located in `src/config/main-config.js`, and should be used to centralize urls and other non-sensitive information that we could need to change at any point without having to go in every file where it's used.

### Debugging tips
you can inspect the background scripts in chrome by going to chrome://extensions and clicking "background.html". You can inspect the popup by right clicking it and selecting "inspect". To inspect a normal page, like the settings (dashboard.html) proceed like normal web pages (Cmd-Alt-I and all that).

## important libraries page side (should be imported in user facing interfaces)

those libraries are used as an interface to use browser specific features and communicate with the background scripts

### vAPI

import `js/vapi.js`, `js/vapi-common.js`, `js/vapi-client.js`

main useful functions:

`vAPI.setTimeout(function, timeout)` --> standardize settimout

`vAPI.closePopup()` --> to close the extension popup

`vAPI.localStorage.setItem("propertyName", value)` --> standardized window.localStorage

`vAPI.i18n('textKey')` --> get language specific text to inject through js

`vAPI.messaging` --> important for page <-> background scripts communication

--> `vAPI.messaging.send('channelName', {
        what: "messageName",//mandatory for routing
        property1: "stringProperty",//you can pretty much send any type of data
        property2: {
            subprop: "blabla"
        }
      },
      callback //callback is not mandatory
     )`

--> `vAPI.messaging.addChannelListener('channelName', handler)`

handler should look like this:
```
function(data) {
    if ( !data ) { return; }
    switch ( data.what ) {
    case 'messageName':
        //do stuff
        //you can use data.property1,...
        break;
    }
};
```

### uDom

import `js/udom.js`:

this is a way to manipulate the dom with good cross browser and backward compatibility
examples:

`uDom.nodeFromId("address-field")`

`uDom.nodeFromSelector('#basicTools div[href^="logger-ui.html"]')`

`uDom.nodesFromClass("overlayWindow")`

`uDom('a[href]').on('click', gotoURL)`

### i18n

import `js/i18n.js`:

needed for i18n support. See language management below to know more. Mandatory for user facing interfaces.



## important libraries background side

### Messaging

`/js/messaging.js`

this is the place where all messages coming from the front pages are processed.
there is a default channel, that catches all messages that were not catched by specific channels, and 8 specific channels:
- popupPanel (for the popup)
- contentscript
- elementPicker
- cloudWidget
- dashboard (for the settings)
- loggerUI
- documentBlocked
- scriptlets

to define a new channel, use this template:

```
// channel: channelName

(function() {

var µb = µBlock;
var µw = µWallet;

//define functions used internally here

var onMessage = function(request, sender, callback) {

    // Async for functions that need a callback
    switch ( request.what ) {
    case 'messageName':
        function(request, callback);
        return;

    default:
        break;
    }

    // Sync
    var response;

    switch ( request.what ) {
    case 'hasPopupContentChanged':
        response = something;
        break;
    default:
        return vAPI.messaging.UNHANDLED;
    }

    callback(response);
};

vAPI.messaging.listen('popupPanel', onMessage);
})();
```



## language management

All text in the extension is available in multiple languages using i18n.
Event if you don't have a translation for the text you're currently writting, don't hardcode text in a user facing interface and always use i18n so that it can be translated later.

### How to use:

- insert your new text in `/src/_locales/en/messages.json` in the format:
```
"textKey":{
  "message":"Your text",
  "description":"description of your text and its context"
},
```

- insert the same translated text in the languages you can do yourself using the same format and AT THE SAME LINE for easier maintenance.

- to use in context:
  * add an html attribute on the element where the text should be:
  `<p data-i18n="textKey"></p>`
  * if you want to inject it through js, use
  `vAPI.i18n('textKey')` (needs import `js/vapi.js`, `js/vapi-common.js` to be imported)
