/*******************************************************************************

    Varanida - a browser extension to block requests.
    Copyright (C) 2018 Varanida

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

    Home: https://github.com/Varanida/varanida-extension/
*/

/******************************************************************************/

(function() {

'use strict';

/******************************************************************************/

var messaging = vAPI.messaging;
var password = undefined;
var userDataStore = undefined;
var walletInfoStore = undefined;
var walletIsUnlocked = false;

/******************************************************************************/

var changeUserProfile = function(name, value) {
  userDataStore[name] = value;
  messaging.send(
    'dashboard',
    {
      what: 'setUserData ',
      password: password,
      newCompletionLevel: 1,
      data: userDataStore
    }
  );
};

/******************************************************************************/

var onInputChanged = function(ev) {
    var input = ev.target;
    var name = this.getAttribute('data-setting-name');
    var value = input.value;
    if ( value !== input.value ) {
        input.value = value;
    }
    changeUserProfile(name, value);
};

/******************************************************************************/

var onPreventDefault = function(ev) {
    ev.target.focus();
    ev.preventDefault();
};

/******************************************************************************/

var onUserDataReceived = function(data) {
  if (data) {
    userDataStore = data;
    uDom('[data-setting-type="input"]').forEach(function(uNode) {
      uNode.val(data[uNode.attr('data-setting-name')]);
    });
    uDom('[data-setting-type="radio"]').forEach(function(uNode) {
      uNode.val(data[uNode.attr('data-setting-name')]);
    });
  } else {
    // initialize user data if non-existent
    userDataStore = {};
  }
};

/******************************************************************************/

var onUnlockWallet = function() {
  walletIsUnlocked = true;
  password = uDom.nodeFromId("unlock-password");
  messaging.send('dashboard', { what: 'getUserData', password: password }, onUserDataReceived);
  renderPage();
};

/******************************************************************************/

var renderPage = function() {
  if ( !walletInfoStore.hasWallet) {
    uDom.nodeFromId('userProfileForm').style.setProperty("display", "none");
    uDom.nodeFromId('userUnlockWallet').style.setProperty("display", "none");
    uDom.nodeFromId('userHasNoWallet').style.setProperty("display", "block");
  } else if ( !walletIsUnlocked ) {
    uDom.nodeFromId('userProfileForm').style.setProperty("display", "none");
    uDom.nodeFromId('userUnlockWallet').style.setProperty("display", "block");
    uDom.nodeFromId('userHasNoWallet').style.setProperty("display", "none");
    if ( walletInfoStore.onlyAddress ) {
      uDom.nodeFromId('userUnlockWalletWithPassword').style.setProperty("display", "none");
      uDom.nodeFromId('userUnlockWalletWithPrivkey').style.setProperty("display", "block");
    } else {
      uDom.nodeFromId('userUnlockWalletWithPassword').style.setProperty("display", "block");
      uDom.nodeFromId('userUnlockWalletWithPrivkey').style.setProperty("display", "none");
    }
  } else {
    uDom.nodeFromId('userProfileForm').style.setProperty("display", "block");
    uDom.nodeFromId('userUnlockWallet').style.setProperty("display", "none");
    uDom.nodeFromId('userHasNoWallet').style.setProperty("display", "none");
  }
};

/******************************************************************************/

var onReadWalletInfo = function(walletInfo) {
  walletInfoStore = walletInfo;
  renderPage();
};

/******************************************************************************/

uDom.onLoad(function() {
    messaging.send('dashboard', { what: 'getWalletInfo' }, onReadWalletInfo);

    uDom('#unlockWalletButton').on('click', onUnlockWallet);
    uDom('[data-setting-type="input"]').forEach(function(uNode) {
      uNode.on('change', onInputChanged).on('click', onPreventDefault);
    });
    uDom('[data-setting-type="radio"]').forEach(function(uNode) {
      uNode.on('click', onInputChanged);
    });
});

/******************************************************************************/

})();
