'use strict';

window.µConfig = {
  urls: {
    front: "https://www.varanida.com/",
    api: "https://api.varanida.com/"
  },
  aws: {
    identityPoolId: "us-east-1:95c6c669-64ea-43ca-baf6-414758edbf1e",
    region: 'us-east-1',
    kinesis: {
      apiVersion: '2013-12-02'
    }
  },
  rewards: {
    install: 50,
    referral: 20,
    bonusPercentageForData: [0,12,24,36]
  },
  rewardedFilterLists: {
    "BGR: Bulgarian Adblock list": true,
    "CHN: EasyList China (中文)": true,
    "CHN: CJX's EasyList Lite": true,
    "CZE, SVK: EasyList Czech and Slovak": true,
    "DEU: EasyList Germany": true,
    "DNK: Schacks Adblock Plus liste": true,
    "EST: Eesti saitidele kohandatud filter": true,
    "FIN: Finnish Addition to Easylist": true,
    "FRA: EasyList Liste FR": true,
    "GRC: Greek AdBlock Filter": true,
    "HUN: hufilter": true,
    "IDN: ABPindo": true,
    "IRN: Adblock-Iran": true,
    "ISL: Icelandic ABP List": true,
    "ISR: EasyList Hebrew": true,
    "ITA: EasyList Italy": true,
    "ITA: ABP X Files": true,
    "JPN: ABP Japanese filters (日本用フィルタ)": true,
    "JPN: Adguard Japan Filter": true,
    "KOR: Korean Adblock List": true,
    "KOR: YousList": true,
    "LTU: Adblock Plus Lithuania": true,
    "LVA: Latvian List": true,
    "NLD: EasyList Dutch": true,
    "NOR: Dandelion Sprouts norske filtre": true,
    "POL: polskie filtry do Adblocka i uBlocka": true,
    "ROU: Romanian Ad (ROad) Block List Light": true,
    "RUS: RU AdList": true,
    "RUS: Adguard Russian Filter": true,
    "SVN: Slovenian List": true,
    "SWE: Frellwit's Swedish Filter": true,
    "TUR: Adguard Turkish Filter": true,
    "VIE: ABPVN List": true,
    "Adguard’s Annoyance List": false,
    "Adguard Base Filters": true,
    "Adguard Mobile Filters": true,
    "Adguard Spyware Filters": false,
    "ara: Liste AR": true,
    "Adblock Warning Removal List": false,
    "Malvertising filter list by Disconnect": false,
    "Dan Pollock’s hosts file": false,
    "EasyList": true,
    "EasyPrivacy": false,
    "Fanboy’s Annoyance List": false,
    "Fanboy’s Cookiemonster List": false,
    "Fanboy’s Enhanced Tracking List": false,
    "Fanboy’s Social Blocking List": false,
    "Fanboy’s Anti-Thirdparty Social (see warning inside list)": false,
    "hpHosts’ Ad and tracking servers": false,
    "Malware Domain List": false,
    "Malware domains": false,
    "MVPS HOSTS": false,
    "Peter Lowe’s Ad and tracking server list": true,
    "spa: EasyList Spanish": true,
    "spa, por: Adguard Spanish/Portuguese": true,
    "Spam404": false,
    "uBlock filters – Resource abuse": true,
    "uBlock filters – Annoyances": false,
    "uBlock filters – Badware risks": false,
    "uBlock filters – Experimental": false,
    "uBlock filters": true,
    "uBlock filters – Privacy": false,
    "uBlock filters – Unbreak": false,
    "Mes filtres": false
  },
  userDataStructure: {
    level1: [
      {
        name: "userBirthdate",
        type: "string"
      },
      {
        name: "userCity",
        type: "string"
      },
      {
        name: "userGender",
        type: "string"
      },
      {
        name: "userMotherTongue",
        type: "string"
      },
      {
        name: "userEducationLevel",
        type: "string"
      },
      {
        name: "userRelationshipStatus",
        type: "string"
      },
      {
        name: "userHasKids",
        type: "string"
      },
      {
        name: "userWorkStatus",
        type: "string"
      },
      {
        name: "userIndustry",
        type: "string"
      }
    ],
    level2: [
      {
        name: "userShareLocation",
        type: "boolean"
      },
      {
        name: "userSharePreferences",
        type: "boolean"
      }
    ],
    level3: [
      {
        name: "userShareSession",
        type: "boolean"
      },
      {
        name: "userShareBrowsingHistory",
        type: "boolean"
      }
    ]
  },
  countryList: [
    {
      id: "AF",
      name: "Afghanistan"
    },
    {
      id: "AX",
      name: "Åland Islands"
    },
    {
      id: "AL",
      name: "Albania"
    },
    {
      id: "DZ",
      name: "Algeria"
    },
    {
      id: "AS",
      name: "American Samoa"
    },
    {
      id: "AD",
      name: "Andorra"
    },
    {
      id: "AO",
      name: "Angola"
    },
    {
      id: "AI",
      name: "Anguilla"
    },
    {
      id: "AQ",
      name: "Antarctica"
    },
    {
      id: "AG",
      name: "Antigua and Barbuda"
    },
    {
      id: "AR",
      name: "Argentina"
    },
    {
      id: "AM",
      name: "Armenia"
    },
    {
      id: "AW",
      name: "Aruba"
    },
    {
      id: "AU",
      name: "Australia"
    },
    {
      id: "AT",
      name: "Austria"
    },
    {
      id: "AZ",
      name: "Azerbaijan"
    },
    {
      id: "BS",
      name: "Bahamas"
    },
    {
      id: "BH",
      name: "Bahrain"
    },
    {
      id: "BD",
      name: "Bangladesh"
    },
    {
      id: "BB",
      name: "Barbados"
    },
    {
      id: "BY",
      name: "Belarus"
    },
    {
      id: "BE",
      name: "Belgium"
    },
    {
      id: "BZ",
      name: "Belize"
    },
    {
      id: "BJ",
      name: "Benin"
    },
    {
      id: "BM",
      name: "Bermuda"
    },
    {
      id: "BT",
      name: "Bhutan"
    },
    {
      id: "BO",
      name: "Bolivia, Plurinational State of"
    },
    {
      id: "BQ",
      name: "Bonaire, Sint Eustatius and Saba"
    },
    {
      id: "BA",
      name: "Bosnia and Herzegovina"
    },
    {
      id: "BW",
      name: "Botswana"
    },
    {
      id: "BV",
      name: "Bouvet Island"
    },
    {
      id: "BR",
      name: "Brazil"
    },
    {
      id: "IO",
      name: "British Indian Ocean Territory"
    },
    {
      id: "BN",
      name: "Brunei Darussalam"
    },
    {
      id: "BG",
      name: "Bulgaria"
    },
    {
      id: "BF",
      name: "Burkina Faso"
    },
    {
      id: "BI",
      name: "Burundi"
    },
    {
      id: "KH",
      name: "Cambodia"
    },
    {
      id: "CM",
      name: "Cameroon"
    },
    {
      id: "CA",
      name: "Canada"
    },
    {
      id: "CV",
      name: "Cape Verde"
    },
    {
      id: "KY",
      name: "Cayman Islands"
    },
    {
      id: "CF",
      name: "Central African Republic"
    },
    {
      id: "TD",
      name: "Chad"
    },
    {
      id: "CL",
      name: "Chile"
    },
    {
      id: "CN",
      name: "China"
    },
    {
      id: "CX",
      name: "Christmas Island"
    },
    {
      id: "CC",
      name: "Cocos (Keeling) Islands"
    },
    {
      id: "CO",
      name: "Colombia"
    },
    {
      id: "KM",
      name: "Comoros"
    },
    {
      id: "CG",
      name: "Congo"
    },
    {
      id: "CD",
      name: "Congo, the Democratic Republic of the"
    },
    {
      id: "CK",
      name: "Cook Islands"
    },
    {
      id: "CR",
      name: "Costa Rica"
    },
    {
      id: "CI",
      name: "Côte d'Ivoire"
    },
    {
      id: "HR",
      name: "Croatia"
    },
    {
      id: "CU",
      name: "Cuba"
    },
    {
      id: "CW",
      name: "Curaçao"
    },
    {
      id: "CY",
      name: "Cyprus"
    },
    {
      id: "CZ",
      name: "Czech Republic"
    },
    {
      id: "DK",
      name: "Denmark"
    },
    {
      id: "DJ",
      name: "Djibouti"
    },
    {
      id: "DM",
      name: "Dominica"
    },
    {
      id: "DO",
      name: "Dominican Republic"
    },
    {
      id: "EC",
      name: "Ecuador"
    },
    {
      id: "EG",
      name: "Egypt"
    },
    {
      id: "SV",
      name: "El Salvador"
    },
    {
      id: "GQ",
      name: "Equatorial Guinea"
    },
    {
      id: "ER",
      name: "Eritrea"
    },
    {
      id: "EE",
      name: "Estonia"
    },
    {
      id: "ET",
      name: "Ethiopia"
    },
    {
      id: "FK",
      name: "Falkland Islands (Malvinas)"
    },
    {
      id: "FO",
      name: "Faroe Islands"
    },
    {
      id: "FJ",
      name: "Fiji"
    },
    {
      id: "FI",
      name: "Finland"
    },
    {
      id: "FR",
      name: "France"
    },
    {
      id: "GF",
      name: "French Guiana"
    },
    {
      id: "PF",
      name: "French Polynesia"
    },
    {
      id: "TF",
      name: "French Southern Territories"
    },
    {
      id: "GA",
      name: "Gabon"
    },
    {
      id: "GM",
      name: "Gambia"
    },
    {
      id: "GE",
      name: "Georgia"
    },
    {
      id: "DE",
      name: "Germany"
    },
    {
      id: "GH",
      name: "Ghana"
    },
    {
      id: "GI",
      name: "Gibraltar"
    },
    {
      id: "GR",
      name: "Greece"
    },
    {
      id: "GL",
      name: "Greenland"
    },
    {
      id: "GD",
      name: "Grenada"
    },
    {
      id: "GP",
      name: "Guadeloupe"
    },
    {
      id: "GU",
      name: "Guam"
    },
    {
      id: "GT",
      name: "Guatemala"
    },
    {
      id: "GG",
      name: "Guernsey"
    },
    {
      id: "GN",
      name: "Guinea"
    },
    {
      id: "GW",
      name: "Guinea-Bissau"
    },
    {
      id: "GY",
      name: "Guyana"
    },
    {
      id: "HT",
      name: "Haiti"
    },
    {
      id: "HM",
      name: "Heard Island and McDonald Islands"
    },
    {
      id: "VA",
      name: "Holy See (Vatican City State)"
    },
    {
      id: "HN",
      name: "Honduras"
    },
    {
      id: "HK",
      name: "Hong Kong"
    },
    {
      id: "HU",
      name: "Hungary"
    },
    {
      id: "IS",
      name: "Iceland"
    },
    {
      id: "IN",
      name: "India"
    },
    {
      id: "ID",
      name: "Indonesia"
    },
    {
      id: "IR",
      name: "Iran, Islamic Republic of"
    },
    {
      id: "IQ",
      name: "Iraq"
    },
    {
      id: "IE",
      name: "Ireland"
    },
    {
      id: "IM",
      name: "Isle of Man"
    },
    {
      id: "IL",
      name: "Israel"
    },
    {
      id: "IT",
      name: "Italy"
    },
    {
      id: "JM",
      name: "Jamaica"
    },
    {
      id: "JP",
      name: "Japan"
    },
    {
      id: "JE",
      name: "Jersey"
    },
    {
      id: "JO",
      name: "Jordan"
    },
    {
      id: "KZ",
      name: "Kazakhstan"
    },
    {
      id: "KE",
      name: "Kenya"
    },
    {
      id: "KI",
      name: "Kiribati"
    },
    {
      id: "KP",
      name: "Korea, Democratic People's Republic of"
    },
    {
      id: "KR",
      name: "Korea, Republic of"
    },
    {
      id: "KW",
      name: "Kuwait"
    },
    {
      id: "KG",
      name: "Kyrgyzstan"
    },
    {
      id: "LA",
      name: "Lao People's Democratic Republic"
    },
    {
      id: "LV",
      name: "Latvia"
    },
    {
      id: "LB",
      name: "Lebanon"
    },
    {
      id: "LS",
      name: "Lesotho"
    },
    {
      id: "LR",
      name: "Liberia"
    },
    {
      id: "LY",
      name: "Libya"
    },
    {
      id: "LI",
      name: "Liechtenstein"
    },
    {
      id: "LT",
      name: "Lithuania"
    },
    {
      id: "LU",
      name: "Luxembourg"
    },
    {
      id: "MO",
      name: "Macao"
    },
    {
      id: "MK",
      name: "Macedonia, the Former Yugoslav Republic of"
    },
    {
      id: "MG",
      name: "Madagascar"
    },
    {
      id: "MW",
      name: "Malawi"
    },
    {
      id: "MY",
      name: "Malaysia"
    },
    {
      id: "MV",
      name: "Maldives"
    },
    {
      id: "ML",
      name: "Mali"
    },
    {
      id: "MT",
      name: "Malta"
    },
    {
      id: "MH",
      name: "Marshall Islands"
    },
    {
      id: "MQ",
      name: "Martinique"
    },
    {
      id: "MR",
      name: "Mauritania"
    },
    {
      id: "MU",
      name: "Mauritius"
    },
    {
      id: "YT",
      name: "Mayotte"
    },
    {
      id: "MX",
      name: "Mexico"
    },
    {
      id: "FM",
      name: "Micronesia, Federated States of"
    },
    {
      id: "MD",
      name: "Moldova, Republic of"
    },
    {
      id: "MC",
      name: "Monaco"
    },
    {
      id: "MN",
      name: "Mongolia"
    },
    {
      id: "ME",
      name: "Montenegro"
    },
    {
      id: "MS",
      name: "Montserrat"
    },
    {
      id: "MA",
      name: "Morocco"
    },
    {
      id: "MZ",
      name: "Mozambique"
    },
    {
      id: "MM",
      name: "Myanmar"
    },
    {
      id: "NA",
      name: "Namibia"
    },
    {
      id: "NR",
      name: "Nauru"
    },
    {
      id: "NP",
      name: "Nepal"
    },
    {
      id: "NL",
      name: "Netherlands"
    },
    {
      id: "NC",
      name: "New Caledonia"
    },
    {
      id: "NZ",
      name: "New Zealand"
    },
    {
      id: "NI",
      name: "Nicaragua"
    },
    {
      id: "NE",
      name: "Niger"
    },
    {
      id: "NG",
      name: "Nigeria"
    },
    {
      id: "NU",
      name: "Niue"
    },
    {
      id: "NF",
      name: "Norfolk Island"
    },
    {
      id: "MP",
      name: "Northern Mariana Islands"
    },
    {
      id: "NO",
      name: "Norway"
    },
    {
      id: "OM",
      name: "Oman"
    },
    {
      id: "PK",
      name: "Pakistan"
    },
    {
      id: "PW",
      name: "Palau"
    },
    {
      id: "PS",
      name: "Palestine, State of"
    },
    {
      id: "PA",
      name: "Panama"
    },
    {
      id: "PG",
      name: "Papua New Guinea"
    },
    {
      id: "PY",
      name: "Paraguay"
    },
    {
      id: "PE",
      name: "Peru"
    },
    {
      id: "PH",
      name: "Philippines"
    },
    {
      id: "PN",
      name: "Pitcairn"
    },
    {
      id: "PL",
      name: "Poland"
    },
    {
      id: "PT",
      name: "Portugal"
    },
    {
      id: "PR",
      name: "Puerto Rico"
    },
    {
      id: "QA",
      name: "Qatar"
    },
    {
      id: "RE",
      name: "Réunion"
    },
    {
      id: "RO",
      name: "Romania"
    },
    {
      id: "RU",
      name: "Russian Federation"
    },
    {
      id: "RW",
      name: "Rwanda"
    },
    {
      id: "BL",
      name: "Saint Barthélemy"
    },
    {
      id: "SH",
      name: "Saint Helena, Ascension and Tristan da Cunha"
    },
    {
      id: "KN",
      name: "Saint Kitts and Nevis"
    },
    {
      id: "LC",
      name: "Saint Lucia"
    },
    {
      id: "MF",
      name: "Saint Martin (French part)"
    },
    {
      id: "PM",
      name: "Saint Pierre and Miquelon"
    },
    {
      id: "VC",
      name: "Saint Vincent and the Grenadines"
    },
    {
      id: "WS",
      name: "Samoa"
    },
    {
      id: "SM",
      name: "San Marino"
    },
    {
      id: "ST",
      name: "Sao Tome and Principe"
    },
    {
      id: "SA",
      name: "Saudi Arabia"
    },
    {
      id: "SN",
      name: "Senegal"
    },
    {
      id: "RS",
      name: "Serbia"
    },
    {
      id: "SC",
      name: "Seychelles"
    },
    {
      id: "SL",
      name: "Sierra Leone"
    },
    {
      id: "SG",
      name: "Singapore"
    },
    {
      id: "SX",
      name: "Sint Maarten (Dutch part)"
    },
    {
      id: "SK",
      name: "Slovakia"
    },
    {
      id: "SI",
      name: "Slovenia"
    },
    {
      id: "SB",
      name: "Solomon Islands"
    },
    {
      id: "SO",
      name: "Somalia"
    },
    {
      id: "ZA",
      name: "South Africa"
    },
    {
      id: "GS",
      name: "South Georgia and the South Sandwich Islands"
    },
    {
      id: "SS",
      name: "South Sudan"
    },
    {
      id: "ES",
      name: "Spain"
    },
    {
      id: "LK",
      name: "Sri Lanka"
    },
    {
      id: "SD",
      name: "Sudan"
    },
    {
      id: "SR",
      name: "Suriname"
    },
    {
      id: "SJ",
      name: "Svalbard and Jan Mayen"
    },
    {
      id: "SZ",
      name: "Swaziland"
    },
    {
      id: "SE",
      name: "Sweden"
    },
    {
      id: "CH",
      name: "Switzerland"
    },
    {
      id: "SY",
      name: "Syrian Arab Republic"
    },
    {
      id: "TW",
      name: "Taiwan, Province of China"
    },
    {
      id: "TJ",
      name: "Tajikistan"
    },
    {
      id: "TZ",
      name: "Tanzania, United Republic of"
    },
    {
      id: "TH",
      name: "Thailand"
    },
    {
      id: "TL",
      name: "Timor-Leste"
    },
    {
      id: "TG",
      name: "Togo"
    },
    {
      id: "TK",
      name: "Tokelau"
    },
    {
      id: "TO",
      name: "Tonga"
    },
    {
      id: "TT",
      name: "Trinidad and Tobago"
    },
    {
      id: "TN",
      name: "Tunisia"
    },
    {
      id: "TR",
      name: "Turkey"
    },
    {
      id: "TM",
      name: "Turkmenistan"
    },
    {
      id: "TC",
      name: "Turks and Caicos Islands"
    },
    {
      id: "TV",
      name: "Tuvalu"
    },
    {
      id: "UG",
      name: "Uganda"
    },
    {
      id: "UA",
      name: "Ukraine"
    },
    {
      id: "AE",
      name: "United Arab Emirates"
    },
    {
      id: "GB",
      name: "United Kingdom"
    },
    {
      id: "US",
      name: "United States"
    },
    {
      id: "UM",
      name: "United States Minor Outlying Islands"
    },
    {
      id: "UY",
      name: "Uruguay"
    },
    {
      id: "UZ",
      name: "Uzbekistan"
    },
    {
      id: "VU",
      name: "Vanuatu"
    },
    {
      id: "VE",
      name: "Venezuela, Bolivarian Republic of"
    },
    {
      id: "VN",
      name: "Viet Nam"
    },
    {
      id: "VI",
      name: "Virgin Islands, U.S."
    },
    {
      id: "WF",
      name: "Wallis and Futuna"
    },
    {
      id: "EH",
      name: "Western Sahara"
    },
    {
      id: "YE",
      name: "Yemen"
    },
    {
      id: "ZM",
      name: "Zambia"
    },
    {
      id: "ZW",
      name: "Zimbabwe"
    }
  ],
  languageList: [
    {
      id: "ab",
      name: "Abkhazian"
    },
    {
      id: "aa",
      name: "Afar"
    },
    {
      id: "af",
      name: "Afrikaans"
    },
    {
      id: "ak",
      name: "Akan"
    },
    {
      id: "sq",
      name: "Albanian"
    },
    {
      id: "am",
      name: "Amharic"
    },
    {
      id: "ar",
      name: "Arabic"
    },
    {
      id: "an",
      name: "Aragonese"
    },
    {
      id: "hy",
      name: "Armenian"
    },
    {
      id: "as",
      name: "Assamese"
    },
    {
      id: "av",
      name: "Avaric"
    },
    {
      id: "ae",
      name: "Avestan"
    },
    {
      id: "ay",
      name: "Aymara"
    },
    {
      id: "az",
      name: "Azerbaijani"
    },
    {
      id: "bm",
      name: "Bambara"
    },
    {
      id: "ba",
      name: "Bashkir"
    },
    {
      id: "eu",
      name: "Basque"
    },
    {
      id: "be",
      name: "Belarusian"
    },
    {
      id: "bn",
      name: "Bengali"
    },
    {
      id: "bh",
      name: "Bihari languages"
    },
    {
      id: "bi",
      name: "Bislama"
    },
    {
      id: "nb",
      name: "Bokm̴l, Norwegian"
    },
    {
      id: "bs",
      name: "Bosnian"
    },
    {
      id: "br",
      name: "Breton"
    },
    {
      id: "bg",
      name: "Bulgarian"
    },
    {
      id: "my",
      name: "Burmese"
    },
    {
      id: "ca",
      name: "Catalan"
    },
    {
      id: "km",
      name: "Central Khmer"
    },
    {
      id: "ch",
      name: "Chamorro"
    },
    {
      id: "ce",
      name: "Chechen"
    },
    {
      id: "ny",
      name: "Chichewa, Nyanja"
    },
    {
      id: "zh",
      name: "Chinese"
    },
    {
      id: "cu",
      name: "Church Slavic, Church Slavonic, Old Bulgarian, Old Church Slavonic"
    },
    {
      id: "cv",
      name: "Chuvash"
    },
    {
      id: "kw",
      name: "Cornish"
    },
    {
      id: "co",
      name: "Corsican"
    },
    {
      id: "cr",
      name: "Cree"
    },
    {
      id: "hr",
      name: "Croatian"
    },
    {
      id: "cs",
      name: "Czech"
    },
    {
      id: "da",
      name: "Danish"
    },
    {
      id: "dv",
      name: "Divehi, Maldivian"
    },
    {
      id: "nl",
      name: "Dutch"
    },
    {
      id: "dz",
      name: "Dzongkha"
    },
    {
      id: "en",
      name: "English"
    },
    {
      id: "eo",
      name: "Esperanto"
    },
    {
      id: "et",
      name: "Estonian"
    },
    {
      id: "ee",
      name: "Ewe"
    },
    {
      id: "fo",
      name: "Faroese"
    },
    {
      id: "fj",
      name: "Fijian"
    },
    {
      id: "fi",
      name: "Finnish"
    },
    {
      id: "fr",
      name: "French"
    },
    {
      id: "ff",
      name: "Fulah"
    },
    {
      id: "gd",
      name: "Gaelic"
    },
    {
      id: "gl",
      name: "Galician"
    },
    {
      id: "lg",
      name: "Ganda"
    },
    {
      id: "ka",
      name: "Georgian"
    },
    {
      id: "de",
      name: "German"
    },
    {
      id: "el",
      name: "Greek, Modern (1453-)"
    },
    {
      id: "gn",
      name: "Guarani"
    },
    {
      id: "gu",
      name: "Gujarati"
    },
    {
      id: "ht",
      name: "Haitian"
    },
    {
      id: "ha",
      name: "Hausa"
    },
    {
      id: "he",
      name: "Hebrew"
    },
    {
      id: "hz",
      name: "Herero"
    },
    {
      id: "hi",
      name: "Hindi"
    },
    {
      id: "ho",
      name: "Hiri Motu"
    },
    {
      id: "hu",
      name: "Hungarian"
    },
    {
      id: "is",
      name: "Icelandic"
    },
    {
      id: "io",
      name: "Ido"
    },
    {
      id: "ig",
      name: "Igbo"
    },
    {
      id: "id",
      name: "Indonesian"
    },
    {
      id: "ia",
      name: "Interlingua (International Auxiliary Language Association)"
    },
    {
      id: "ie",
      name: "Interlingue"
    },
    {
      id: "iu",
      name: "Inuktitut"
    },
    {
      id: "ik",
      name: "Inupiaq"
    },
    {
      id: "ga",
      name: "Irish"
    },
    {
      id: "it",
      name: "Italian"
    },
    {
      id: "ja",
      name: "Japanese"
    },
    {
      id: "jv",
      name: "Javanese"
    },
    {
      id: "kl",
      name: "Kalaallisut"
    },
    {
      id: "kn",
      name: "Kannada"
    },
    {
      id: "kr",
      name: "Kanuri"
    },
    {
      id: "ks",
      name: "Kashmiri"
    },
    {
      id: "kk",
      name: "Kazakh"
    },
    {
      id: "ki",
      name: "Kikuyu"
    },
    {
      id: "rw",
      name: "Kinyarwanda"
    },
    {
      id: "ky",
      name: "Kirghiz"
    },
    {
      id: "kv",
      name: "Komi"
    },
    {
      id: "kg",
      name: "Kongo"
    },
    {
      id: "ko",
      name: "Korean"
    },
    {
      id: "kj",
      name: "Kuanyama"
    },
    {
      id: "ku",
      name: "Kurdish"
    },
    {
      id: "lo",
      name: "Lao"
    },
    {
      id: "la",
      name: "Latin"
    },
    {
      id: "lv",
      name: "Latvian"
    },
    {
      id: "li",
      name: "Limburgan,  Limburgish"
    },
    {
      id: "ln",
      name: "Lingala"
    },
    {
      id: "lt",
      name: "Lithuanian"
    },
    {
      id: "lu",
      name: "Luba-Katanga"
    },
    {
      id: "lb",
      name: "Luxembourgish"
    },
    {
      id: "mk",
      name: "Macedonian"
    },
    {
      id: "mg",
      name: "Malagasy"
    },
    {
      id: "ms",
      name: "Malay"
    },
    {
      id: "ml",
      name: "Malayalam"
    },
    {
      id: "mt",
      name: "Maltese"
    },
    {
      id: "gv",
      name: "Manx"
    },
    {
      id: "mi",
      name: "Maori"
    },
    {
      id: "mr",
      name: "Marathi"
    },
    {
      id: "mh",
      name: "Marshallese"
    },
    {
      id: "mn",
      name: "Mongolian"
    },
    {
      id: "na",
      name: "Nauru"
    },
    {
      id: "nv",
      name: "Navajo"
    },
    {
      id: "nd",
      name: "Ndebele, North"
    },
    {
      id: "nr",
      name: "Ndebele, South"
    },
    {
      id: "ng",
      name: "Ndonga"
    },
    {
      id: "ne",
      name: "Nepali"
    },
    {
      id: "se",
      name: "Northern Sami"
    },
    {
      id: "no",
      name: "Norwegian"
    },
    {
      id: "nn",
      name: "Norwegian Nynorsk"
    },
    {
      id: "oc",
      name: "Occitan (post 1500)"
    },
    {
      id: "oj",
      name: "Ojibwa"
    },
    {
      id: "or",
      name: "Oriya"
    },
    {
      id: "om",
      name: "Oromo"
    },
    {
      id: "os",
      name: "Ossetian"
    },
    {
      id: "pi",
      name: "Pali"
    },
    {
      id: "pa",
      name: "Panjabi"
    },
    {
      id: "fa",
      name: "Persian"
    },
    {
      id: "pl",
      name: "Polish"
    },
    {
      id: "pt",
      name: "Portuguese"
    },
    {
      id: "ps",
      name: "Pushto"
    },
    {
      id: "qu",
      name: "Quechua"
    },
    {
      id: "ro",
      name: "Romanian, Moldovan"
    },
    {
      id: "rm",
      name: "Romansh"
    },
    {
      id: "rn",
      name: "Rundi"
    },
    {
      id: "ru",
      name: "Russian"
    },
    {
      id: "sm",
      name: "Samoan"
    },
    {
      id: "sg",
      name: "Sango"
    },
    {
      id: "sa",
      name: "Sanskrit"
    },
    {
      id: "sc",
      name: "Sardinian"
    },
    {
      id: "sr",
      name: "Serbian"
    },
    {
      id: "sn",
      name: "Shona"
    },
    {
      id: "ii",
      name: "Sichuan Yi"
    },
    {
      id: "sd",
      name: "Sindhi"
    },
    {
      id: "si",
      name: "Sinhala"
    },
    {
      id: "sk",
      name: "Slovak"
    },
    {
      id: "sl",
      name: "Slovenian"
    },
    {
      id: "so",
      name: "Somali"
    },
    {
      id: "st",
      name: "Sotho, Southern"
    },
    {
      id: "es",
      name: "Spanish"
    },
    {
      id: "su",
      name: "Sundanese"
    },
    {
      id: "sw",
      name: "Swahili"
    },
    {
      id: "ss",
      name: "Swati"
    },
    {
      id: "sv",
      name: "Swedish"
    },
    {
      id: "tl",
      name: "Tagalog"
    },
    {
      id: "ty",
      name: "Tahitian"
    },
    {
      id: "tg",
      name: "Tajik"
    },
    {
      id: "ta",
      name: "Tamil"
    },
    {
      id: "tt",
      name: "Tatar"
    },
    {
      id: "te",
      name: "Telugu"
    },
    {
      id: "th",
      name: "Thai"
    },
    {
      id: "bo",
      name: "Tibetan"
    },
    {
      id: "ti",
      name: "Tigrinya"
    },
    {
      id: "to",
      name: "Tonga (Tonga Islands)"
    },
    {
      id: "ts",
      name: "Tsonga"
    },
    {
      id: "tn",
      name: "Tswana"
    },
    {
      id: "tr",
      name: "Turkish"
    },
    {
      id: "tk",
      name: "Turkmen"
    },
    {
      id: "tw",
      name: "Twi"
    },
    {
      id: "ug",
      name: "Uighur"
    },
    {
      id: "uk",
      name: "Ukrainian"
    },
    {
      id: "ur",
      name: "Urdu"
    },
    {
      id: "uz",
      name: "Uzbek"
    },
    {
      id: "ve",
      name: "Venda"
    },
    {
      id: "vi",
      name: "Vietnamese"
    },
    {
      id: "vo",
      name: "Volapük"
    },
    {
      id: "wa",
      name: "Walloon"
    },
    {
      id: "cy",
      name: "Welsh"
    },
    {
      id: "fy",
      name: "Western Frisian"
    },
    {
      id: "wo",
      name: "Wolof"
    },
    {
      id: "xh",
      name: "Xhosa"
    },
    {
      id: "yi",
      name: "Yiddish"
    },
    {
      id: "yo",
      name: "Yoruba"
    },
    {
      id: "za",
      name: "Zhuang"
    },
    {
      id: "zu",
      name: "Zulu"
    }
  ]
};
