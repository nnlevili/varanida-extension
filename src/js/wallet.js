/*******************************************************************************

    uBlock Origin - a browser extension to block requests.
    Copyright (C) 2014-2016 Raymond Hill

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

    Home: https://github.com/gorhill/uBlock
*/

/* global uDom, uBlockDashboard */

/******************************************************************************/

(function() {

'use strict';

/******************************************************************************/

var messaging = vAPI.messaging;
var walletInfoStore = null;
/******************************************************************************/

function renderExportField(exportValues) {
  if (!exportValues || exportValues.address !== walletInfoStore.walletAddress) {
    return;
  }
  var passwordField = uDom.nodeFromId("export-privkey-password");
  passwordField.value = "";
  var seedInput = uDom.nodeFromId("seed-field");
  seedInput.value = exportValues.seed;
  var privKeyInput = uDom.nodeFromId("privkey-field");
  privKeyInput.value = exportValues.privKey;
  uDom.nodeFromId('hidePrivKeyButton').style.setProperty("display", "inline-block");
  uDom.nodeFromId('exportData').style.setProperty("display", "block");

}
/******************************************************************************/

function onHideExport() {
  var seedInput = uDom.nodeFromId("seed-field");
  seedInput.value = "";
  var privKeyInput = uDom.nodeFromId("privkey-field");
  privKeyInput.value = "";
  uDom.nodeFromId('hidePrivKeyButton').style.setProperty("display", "none");
  uDom.nodeFromId('exportData').style.setProperty("display", "none");
}

/******************************************************************************/

function onExportWallet() {
  var onExportHandler = function(exportValues) {
    console.log(exportValues);
    var errorMessage = uDom.nodeFromId("errorMessage");
    if (typeof exportValues === "string") {
      errorMessage.textContent = exportValues;
      return;
    }
    errorMessage.textContent = "";
    /*{
      address: string,
      privKey: string,
      seed: string
    }*/
    renderExportField(exportValues);
  }
  var passwordField = uDom.nodeFromId("export-privkey-password");
  var pass1 = passwordField.value;
  messaging.send('dashboard', { what: 'exportWalletInfo', password: pass1 }, onExportHandler);
}

/******************************************************************************/

function onDeleteWallet() {
  var onDeleteHandler = function(success) {
    if (!success) {
      var errorField = uDom.nodeFromId("delete-wallet-overlay-error");
      errorField.textContent = vAPI.i18n('deleteWalletError');
      return console.log("error deleting wallet");
    }
    hideOverlay("delete-modal");
    renderWalletInfo();
  }
  var pass1 = null;
  if (walletInfoStore && !walletInfoStore.onlyAddress) {
    var passwordField = uDom.nodeFromId("delete-wallet-password");
    pass1 = passwordField.value;
  }
  messaging.send('dashboard', { what: 'deleteWallet', password: pass1}, onDeleteHandler);
}

/******************************************************************************/

function renderWalletInfo() {
    var onRead = function(walletInfo) {
      /* {
        hasWallet: boolean,
        walletAddress: string,
        totalRewardCount: number,
        onlyAddress: boolean,
      };*/
        if ( !walletInfo.hasWallet) {
          uDom.nodeFromId('walletAddress').textContent = vAPI.i18n('noWalletText');
          return;
        }
        walletInfoStore = walletInfo;
        uDom.nodeFromId('walletAddress').textContent = walletInfo.walletAddress;
        if (!walletInfo.onlyAddress) {
          uDom.nodeFromId('walletFunctions').style.setProperty("display", "block");
          uDom('#exportPrivKeyButton').on('click', onExportWallet);
          uDom('#hidePrivKeyButton').on('click', onHideExport);
        }
    };
    messaging.send('dashboard', { what: 'getWalletInfo' }, onRead);
}

/******************************************************************************/

var copyAdressToClipboard = function(field) {
  var addressInput = uDom.nodeFromId(field+"-field");
  var button = uDom.nodeFromId(field+"-clipboard-button");
  var resetButton = function() {
    if (button && button.innerHTML) {
      button.innerHTML = "&#xf0c5;"
      button.style.setProperty("color", "#71727B");
    }
  }
  if (addressInput && addressInput.select){
    addressInput.focus();
    addressInput.select();
    document.execCommand("copy");
    addressInput.blur();
    button.innerHTML = "&#xf00c;"
    button.style.setProperty("color", "#19cc58");
    vAPI.setTimeout(resetButton, 2000);
  }

}

var hideOverlay = function(overlayId) {
  var overlaysContainer = uDom.nodeFromId("modal-overlay");
  var overlaysList = uDom.nodesFromClass("modal-window");
  if (overlayId === "delete-modal" || overlayId === "all") {
    uDom.nodeFromId('delete-overlay-password-div').style.setProperty("display", "none");
    var passwordField = uDom.nodeFromId("delete-wallet-password");
    passwordField.value = "";
  }
  for (var i = 0; i < overlaysList.length; i++) {
    overlaysList[i].style.setProperty("display", "none");
  }
  overlaysContainer.style.setProperty("display", "none");
}
/******************************************************************************/

var openDeleteModal = function() {
  uDom.nodeFromId('modal-overlay').style.setProperty("display", "block");
  uDom.nodeFromId('delete-modal').style.setProperty("display", "block");
  if (walletInfoStore && !walletInfoStore.onlyAddress) {
    uDom.nodeFromId('delete-overlay-password-div').style.setProperty("display", "block");
  }
}

// Handle user interaction
// uDom('#userFiltersRevert').on('click', revertChanges);

renderWalletInfo();

uDom('#seed-clipboard-button').on('click', function() {copyAdressToClipboard("seed");});
uDom('#privkey-clipboard-button').on('click', function() {copyAdressToClipboard("privkey");});
uDom('#delete-wallet-button').on('click', openDeleteModal);
uDom('#delete-wallet-button-overlay').on('click', onDeleteWallet);
uDom('#cancel-delete-wallet-button-overlay').on('click', function() {hideOverlay("delete-modal");});

uDom('.overlayClose').on('click', function(){hideOverlay("all");})

/******************************************************************************/

})();
