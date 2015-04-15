Open Food Facts mobile app
==========================

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

# Development notes

Instructions for Android and the version of the app that uses the Moodstocks scanner plugin (iOS and Android only)
http://en.wiki.openfoodfacts.org/Mobile_App_Development_Notes
