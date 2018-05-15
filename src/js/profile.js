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

var calculateNewCompletionLevel = function() {
  if (userDataStore &&
      userDataStore.level1 &&
      userDataStore.level1.userBirthdate &&
      userDataStore.level1.userCity &&
      userDataStore.level1.userGender &&
      userDataStore.level1.userMotherTongue &&
      userDataStore.level1.userEducationLevel &&
      userDataStore.level1.userRelationshipStatus &&
      userDataStore.level1.userHasKids &&
      userDataStore.level1.userWorkStatus &&
      userDataStore.level1.userIndustry) {
      if (userDataStore.level2 &&
            userDataStore.level2.userShareLocation &&
            userDataStore.level2.userSharePreferences) {
            if (userDataStore.level3 &&
                userDataStore.level3.userShareSession &&
                userDataStore.level3.userShareBrowsingHistory) {
                return 3;
            } else {
                return 2;
            }
      } else {
          return 1;
      }
  } else {
      return 0;
  }
};

/******************************************************************************/

var displayCompletionLevel = function(level) {

    uDom.nodeFromSelector('.currentLevel').style.setProperty("display", "none");

    if (level === 3) {
        uDom.nodeFromId('currentLevel3').style.setProperty("display", "block");
    } else if (level === 2) {
        uDom.nodeFromId('currentLevel2').style.setProperty("display", "block");
    } else if (level === 1){
        uDom.nodeFromId('currentLevel1').style.setProperty("display", "block");
    } else {
        uDom.nodeFromId('currentLevel0').style.setProperty("display", "block");
    }
    uDom.nodeFromId('profileLevel3Checked').style.setProperty("display", level > 2 ? "block" : "none");
    uDom.nodeFromId('profileLevel2Checked').style.setProperty("display", level > 1 ? "block" : "none");
    uDom.nodeFromId('profileLevel1Checked').style.setProperty("display", level > 0 ? "block" : "none");

};
/******************************************************************************/

var browseLevels = function(ev) {
    uDom('.m-wizard__step').removeClass("m-wizard__step--current");
    uDom(this).addClass("m-wizard__step--current");
    uDom('.m-wizard__form-step').removeClass("m-wizard__form-step--current");
    let level = this.getAttribute("data-level");
    uDom('#m_wizard_form_step_'+level).addClass("m-wizard__form-step--current");
};
/******************************************************************************/

var changeUserProfile = function(level, name, value) {
  if (!userDataStore) {
    userDataStore = {};
  }
  if (!userDataStore['level'+level]) {
    userDataStore['level'+level] = {};
  }
  userDataStore['level'+level][name] = value;

  //Display level
  displayCompletionLevel(level);
};

/******************************************************************************/

var onInputChanged = function(ev) {
    var input = ev.target;
    var level = this.getAttribute('data-setting-level');
    var name = this.getAttribute('data-setting-name');
    var value = input.value;
    if ( value !== input.value ) {
        input.value = value;
    }
    changeUserProfile(level, name, value);
};

/******************************************************************************/

var onPreventDefault = function(ev) {
    ev.target.focus();
    ev.preventDefault();
};

/******************************************************************************/

var onUserDataReceived = function(data) {
  if (typeof data !== 'string') {
    userDataStore = data;
    uDom('[data-setting-type="input"]').forEach(function(uNode) {
      uNode.val(data[uNode.attr('data-setting-name')]);
    });
    uDom('[data-setting-type="radio"]').forEach(function(uNode) {
      uNode.val(data[uNode.attr('data-setting-name')]);
    });
  }
};

/******************************************************************************/

var onUnlockWallet = function() {
    password = uDom.nodeFromId("unlock-password");
    if (password.value === '') {
        uDom.nodeFromId('errorUnlockWalletMessage').style.setProperty("display", "block");
        uDom.nodeFromId('errorUnlockWalletMessagePasswordEmpty').style.setProperty("display", "block");
        return false;
    } else {
        walletIsUnlocked = true;
        messaging.send('dashboard', { what: 'getUserData', password: password }, onUserDataReceived);
        renderPage();
    }
};

/******************************************************************************/

var onProfileSave = function() {
    let newCompletionLevel = calculateNewCompletionLevel();
    messaging.send(
        'dashboard',
        {
            what: 'setUserData ',
            password: password,
            newCompletionLevel: newCompletionLevel,
            data: userDataStore
        }
    );
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
    uDom.nodeFromId('errorUnlockWalletMessage').style.setProperty("display", "none");
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
    uDom('#profileSaveButton').on('click', onProfileSave);
    uDom('[data-setting-type="input"]').forEach(function(uNode) {
      uNode.on('change', onInputChanged).on('click', onPreventDefault);
    });
    uDom('[data-setting-type="radio"]').forEach(function(uNode) {
      uNode.on('click', onInputChanged);
    });
    uDom('.m-wizard__step').on('click', browseLevels);

});

/******************************************************************************/

})();
