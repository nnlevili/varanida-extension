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
    var privkey = undefined;
    var userDataStore = undefined;
    var walletInfoStore = undefined;
    var walletIsUnlocked = false;

    /******************************************************************************/

    var testLevel = function(level) {
      var lvlStr = "level"+level;
      if (!userDataStore || !userDataStore[lvlStr]) {
        return false;
      }
      var levelStructure = µConfig.userDataStructure[lvlStr];
      var levelStore = userDataStore[lvlStr];
      for (var i = 0; i < levelStructure.length; i++) {
        if (
          !levelStore[levelStructure[i].name] ||
          typeof levelStore[levelStructure[i].name] !== levelStructure[i].type
        ) {
          return false;
        }
      }
      return true;
    };

    var calculateNewCompletionLevel = function() {
        if (testLevel(1)) {
            if (testLevel(2)) {
                if (testLevel(3)) {
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

        uDom(".currentLevel").text(level);

        uDom.nodeFromId('profileLevel3Checked').style.setProperty("display", level > 2 ? "block" : "none");
        uDom.nodeFromId('profileLevel2Checked').style.setProperty("display", level > 1 ? "block" : "none");
        uDom.nodeFromId('profileLevel1Checked').style.setProperty("display", level > 0 ? "block" : "none");
    };
    /******************************************************************************/

    var browseLevels = function(ev) {
        uDom('.m-wizard__step').removeClass("m-wizard__step--current");
        uDom(this).addClass("m-wizard__step--current");
        uDom('.m-wizard__form-step').removeClass("m-wizard__form-step--current");
        var level = this.getAttribute("data-level");
        uDom('#m_wizard_form_step_'+level).addClass("m-wizard__form-step--current");
        displayInfoLevel(level);
    };
    /******************************************************************************/

    var displayInfoLevel = function(level) {
        var dataSettingsBonusStr = vAPI.i18n('popupDataSettingsBonus');
        var bonus = µConfig.rewards.bonusPercentageForData[level];
        uDom.nodeFromId('dataBonusInfo').textContent = vAPI.i18n('popupDataSettingsBonus').replace('{{bonus}}', bonus);
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
        displayCompletionLevel(calculateNewCompletionLevel());
    };

    /******************************************************************************/

    var onInputChanged = function(ev) {
        var input = ev.target;
        var level = this.getAttribute('data-setting-level');
        var name = this.getAttribute('data-setting-name');
        var type = this.getAttribute('data-setting-type');
        var value = input.value;
        if(type === "checkbox"){
            value = uDom(this).prop('checked');
        }
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

    var initDropDown = function(element, configList) {
      for (var i = 0; i < configList.length; i++) {
        var opt = configList[i];
        var el = document.createElement("option");
        el.textContent = opt.name;
        el.value = opt.id;
        element.appendChild(el);
      }
    };

    /******************************************************************************/

    var initLanguageDropDown = function(element, configList) {
      var locale = navigator.language;
      var localeStr = null;
      var placedLocale = false;
      if (navigator.languages && navigator.languages.length > 0) {
          locale = navigator.languages[0];
      }
      localeStr = locale.split('-')[0].toLowerCase();
      if (localeStr) {
        for (var j = 0; j < configList.length; j++) {
          if (configList[j].id === localeStr) {
            var localEl = document.createElement("option");
            localEl.textContent = configList[j].name;
            localEl.value = configList[j].id;
            element.appendChild(localEl);
            placedLocale = true;
            break;
          }
        }
      }
      var opt, el;
      for (var i = 0; i < configList.length; i++) {
        opt = configList[i];
        if (placedLocale && opt.id === localeStr) {
          continue;
        }
        el = document.createElement("option");
        el.textContent = opt.name;
        el.value = opt.id;
        element.appendChild(el);
      }
    };

    /******************************************************************************/

    var initFlatpickr = function() {

        var locale = navigator.language;
        if (navigator.languages && navigator.languages.length > 0) {
            locale = navigator.languages[0];
        }
        var localeStr = locale.split('-')[0].toLowerCase();
        var startDate = "";
        if (userDataStore &&
          userDataStore.level1 &&
          userDataStore.level1.userBirthdate &&
          /\d{4}-\d{1,2}-\d{1,2}/.test(userDataStore.level1.userBirthdate)
        ) {
          startDate = userDataStore.level1.userBirthdate;
        }
        flatpickr("#user-birthdate", {
            "locale": localeStr,
            "defaultDate": startDate
        });
    };

    /******************************************************************************/

    var onUserDataReceived = function(data) {
        var errorMessage = uDom.nodeFromId("errorUnlockWalletMessage");
        if (typeof data !== 'string') {
            userDataStore = data;
            walletIsUnlocked = true;
            uDom('[data-setting-type="input"]').forEach(function(uNode) {
                if (data['level'+uNode.attr('data-setting-level')]) {
                    uNode.val(data['level'+uNode.attr('data-setting-level')][uNode.attr('data-setting-name')]);
                }
            });
            uDom('[data-setting-type="checkbox"]').forEach(function(uNode) {
                if (data['level'+uNode.attr('data-setting-level')]) {
                    uNode.prop('checked', data['level'+uNode.attr('data-setting-level')][uNode.attr('data-setting-name')] === true);
                }
            });
            uDom('[data-setting-type="radio"]').forEach(function(uNode) {
                if (data['level'+uNode.attr('data-setting-level')]) {
                    uNode.prop('checked', data['level'+uNode.attr('data-setting-level')][uNode.attr('data-setting-name')] === uNode.attr('value'));
                }
            });
            renderPage();
            initFlatpickr();
            displayCompletionLevel(calculateNewCompletionLevel());
            errorMessage.textContent = "";
            uDom.nodeFromId('errorUnlockWalletBlock').style.setProperty("display", "none");
            uDom.nodeFromId("unlock-password").value = "";
            uDom.nodeFromId("unlock-privkey").value = "";
        } else {
            if (data.indexOf("i18n-") === 0) {
              errorMessage.textContent = vAPI.i18n(data.substr(5));
            } else {
              if (walletInfoStore && walletInfoStore.onlyAddress) {
                errorMessage.textContent = vAPI.i18n('privKeyError');
              } else {
                errorMessage.textContent = vAPI.i18n('passwordError');
              }
            }
            uDom.nodeFromId('errorUnlockWalletBlock').style.setProperty("display", "block");
        }
    };

    /******************************************************************************/

    var afterSave = function(saveError) {
      if (!saveError) {
        var button = uDom.nodeFromId("profileSaveButton");
        var resetButton = function() {
          if (button && button.innerHTML) {
            button.innerHTML =
            '<span>'+
                '<i class="la la-save"></i>'+
                '<span data-i18n="profileSave">'+vAPI.i18n("profileSave")+'</span>'+
            '</span>';
          }
        }
        button.innerHTML =
        '<span>'+
            '<i class="la la-check"></i>'+
            '<span>'+vAPI.i18n("profileSaved")+'</span>'+
        '</span>';
        vAPI.setTimeout(resetButton, 2000);
    }
    }

    var onProfileSave = function() {
        let newCompletionLevel = calculateNewCompletionLevel();
        messaging.send(
            'dashboard',
            {
                what: 'setUserData',
                password: password,
                privKey: privkey,
                newCompletionLevel: newCompletionLevel,
                data: userDataStore
            },
            afterSave
        );
    };

    /******************************************************************************/

    var renderPage = function() {
        if ( !walletInfoStore || !walletInfoStore.hasWallet) {
            uDom.nodeFromId('userProfileForm').style.setProperty("display", "none");
            uDom.nodeFromId('userUnlockWallet').style.setProperty("display", "none");
            uDom.nodeFromId('userHasNoWallet').style.setProperty("display", "block");
        } else if ( !walletIsUnlocked ) {
            uDom.nodeFromId('userProfileForm').style.setProperty("display", "none");
            uDom.nodeFromId('userUnlockWallet').style.setProperty("display", "block");
            uDom.nodeFromId('errorUnlockWalletBlock').style.setProperty("display", "none");
            uDom.nodeFromId('userHasNoWallet').style.setProperty("display", "none");
            if ( walletInfoStore && walletInfoStore.onlyAddress ) {
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

    var onUnlockWallet = function() {
        password = uDom.nodeFromId("unlock-password").value;
        privkey = uDom.nodeFromId("unlock-privkey").value;
        messaging.send('dashboard', { what: 'getUserData', password: password , privKey: privkey}, onUserDataReceived);
    };

    /******************************************************************************/

    var onLockWallet = function() {
        var onLockHandler = function() {
            password = undefined;
            privkey = undefined;
            userDataStore = undefined;
            walletIsUnlocked = false;
            renderPage();
        };
        messaging.send('dashboard', { what: 'lockWallet' }, onLockHandler);
    };

    /******************************************************************************/

    var onReadWalletInfo = function(walletInfo) {
        walletInfoStore = walletInfo;
        if (walletInfo && walletInfo.isUnlocked === true) {
            walletIsUnlocked = true;
            onUnlockWallet();
        } else {
            renderPage();
        }
    };

    /******************************************************************************/

    uDom.onLoad(function() {
        messaging.send('dashboard', { what: 'getWalletInfo' }, onReadWalletInfo);
        uDom('#unlockWalletButton').on('click', onUnlockWallet);
        uDom('.unlock-wallet-field').on("keyup", function(event) {
          event.preventDefault();
          if (event.keyCode === 13) {
            onUnlockWallet();
          }
        });
        initDropDown(uDom.nodeFromId("user-city"), µConfig.countryList);
        initLanguageDropDown(uDom.nodeFromId("user-mother-tongue"), µConfig.languageList);
        uDom('#lockWalletButton').on('click', onLockWallet);
        uDom('#profileSaveButton').on('click', onProfileSave);
        uDom('[data-setting-type="input"]').forEach(function(uNode) {
            uNode.on('change', onInputChanged).on('click', onPreventDefault);
        });
        uDom('[data-setting-type="checkbox"]').forEach(function(uNode) {
            uNode.on('click', onInputChanged);
        });
        uDom('[data-setting-type="radio"]').forEach(function(uNode) {
            uNode.on('click', onInputChanged);
        });
        uDom('.m-wizard__step').on('click', browseLevels);
        displayInfoLevel(1);
    });

    /******************************************************************************/

})();
