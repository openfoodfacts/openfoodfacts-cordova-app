Open Food Facts Cordova mobile app
==========================
[![Build Status](https://travis-ci.org/openfoodfacts/cordova-app.svg?branch=master)](https://travis-ci.org/openfoodfacts/cordova-app) [![Stories in Ready](https://badge.waffle.io/openfoodfacts/cordova-app.svg?label=ready&title=Ready)](https://waffle.io/openfoodfacts/cordova-app)


This application is based on [Apache Cordova](https://cordova.apache.org/)
framework which allows you to develop for multiple platforms (iOS, Android,
Firefox OS for a few of them) at the same time.

# Build
Here are the steps to build and test the application.  Be aware that it's an
alpha version at the moment.

First, clone it.

Then, will need [Apache Cordova](https://cordova.apache.org/) installed and you
may use a [Firefox Developer
Edition](https://www.mozilla.org/fr/firefox/developer/) on version 39 at least;
it provides developing tools for Cordova framework.

To install [Apache Cordova](https://cordova.apache.org/), you can use Node
Package Manager.

```
npm install -g cordova
```

Install also the platforms you need.  For example

```
cordova platform add firefoxos
```

Use `cordova platform` to know which platform you can install.

Now, run Firefox Developer Edition and open WebIDE (Shift+F8).  Click *Projects*
and *Open Packaged App...* and find the cloned repository of `cordova-app`.  You
should now have the application opened in WebIDE and you can run it into a
Firefox OS simulator or onto your FirefoxOS phone.

## Barcode scanner

You may also have to install [Apache Cordova](https://cordova.apache.org/) plugin for barcode scanning.

```
cordova plugin add com.phonegap.plugins.barcodescanner
```

However, this plugin is not compatible with Firefox OS (see [sources on
Github](https://github.com/wildabeast/BarcodeScanner)).  It seems that there is
no barcode scanner plugin for Cordova (see
[here](http://plugreg.com/search?q=barcode#platform=firefoxos)).

# Development notes

Instructions for Android and the version of the app that uses the Moodstocks scanner plugin (iOS and Android only)
https://en.wiki.openfoodfacts.org/Mobile_App_Development_Notes


## What is Open Food Facts?

### A food products database

Open Food Facts is a database of food products with ingredients, allergens, nutrition facts and all the tidbits of information we can find on product labels.

### Made by everyone

Open Food Facts is a non-profit association of volunteers.
1800+ contributors like you have added 43 000+ products from 150 countries using our Android, iPhone or Windows Phone app or their camera to scan barcodes and upload pictures of products and their labels.

### For everyone

Data about food is of public interest and has to be open. The complete database is published as open data and can be reused by anyone and for any use. Check-out the cool reuses or make your own!
- <https://world.openfoodfacts.org>

### Translate Open Food Facts in your language

You can help translate Open Food Facts and the app at (no technical knowledge required, takes a minute to signup): <br>
https://translations.launchpad.net/openfoodfacts/openfoodfacts-ios/+translations

## Bugs and feature requests

Have a bug or a feature request? Please search for existing and closed issues. If your problem or idea is not addressed yet, please open a new issue.

## Waffle Throughput Graph

[![Throughput Graph](https://graphs.waffle.io/openfoodfacts/cordova-app/throughput.svg)](https://waffle.io/openfoodfacts/cordova-app/metrics/throughput)
