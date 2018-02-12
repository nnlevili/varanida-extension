#!/usr/bin/env bash
#
# This script assumes a linux environment

DES=$1/assets

printf "*** Packaging assets in $DES... "

rm -rf $DES
mkdir $DES
cp    ./assets/assets.json                                       $DES/

mkdir $DES/thirdparties
cp -R ../varanida-extension-assets/thirdparties/easylist-downloads.adblockplus.org $DES/thirdparties/
cp -R ../varanida-extension-assets/thirdparties/mirror1.malwaredomains.com         $DES/thirdparties/
cp -R ../varanida-extension-assets/thirdparties/pgl.yoyo.org                       $DES/thirdparties/
cp -R ../varanida-extension-assets/thirdparties/publicsuffix.org                   $DES/thirdparties/
cp -R ../varanida-extension-assets/thirdparties/www.malwaredomainlist.com          $DES/thirdparties/

mkdir $DES/ublock
cp -R ../varanida-extension-assets/filters/*                                       $DES/ublock/
# Optional filter lists: do not include in package
rm    $DES/ublock/annoyances.txt

echo "done."
