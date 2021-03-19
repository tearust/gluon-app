#GLUON
As part of the TEA-Rust project, the end goal of Gluon is to serve as a replacement for traditional hardware crypto wallets. GLUON pertains to the category: Trust-as-a-Service, relying on distributed storage and execution in TEA nodes to elevate security.

For further details please refer to https://github.com/tearust/gluon-docs/tree/master/Blog_and_Vlog

This repo contains runtimes for the GLUON web-app and mobile-app.

## Standard Setup Instructions

### GLUON-WEBAPP

#### Run in local
```
cd webapp
npm i
npm start
```
Click [http://127.0.0.1:3000/](http://127.0.0.1:3000/) to visit.
Notice that make sure the node version greater than 14.

-----


### GLUON-MOBILE-APP

[Download ios app](http://d.zqapps.com/m63e)

#### Run in local
```
cd mobile
npm i
cd ios
pod install
```

* Open mobile/ios/mobile.xcworkspace with XCode.
* Run it with iOS simulator.

## Walkthrough and Instructions
### Basic UI Walkthrough
1. To install the Polkadot{.js} browser extension, please refer to the links below. Available on both Google Chrome and Firefox
   - Download the Chrome extension [here](https://chrome.google.com/webstore/detail/polkadot%7Bjs%7D-extension/mopnmbcafieddcagagdcbnhejhlodfdd/related)&nbsp;
   <img src="https://github.com/tearust/gluon-app/blob/main/public/images/chrome-extension-install.png" width="800" height="200">
   &nbsp;

   - Download the Firefox extension [here](https://addons.mozilla.org/en-US/firefox/addon/polkadot-js-extension/)&nbsp;
   <img src="https://github.com/tearust/gluon-app/blob/main/public/images/firefox-extension-install.png" width="600" height="200">
   &nbsp;
   &nbsp;
2. To check for successful installation, please reference the examples below:
   - Chrome &nbsp;
   <img src="https://github.com/tearust/gluon-app/blob/main/public/images/chrome-extension-success.png" width="320" height="350">

   - Firefox &nbsp;
   <img src="https://github.com/tearust/gluon-app/blob/main/public/images/firefox-extension-sucess.png" width="320" height="160">
   &nbsp;
   &nbsp;

4. To create polkadot account, navigate to the extension pop up and click the add button:
    <img src="https://github.com/tearust/gluon-app/blob/main/public/images/polkadot-add-account.png" width="320" height="400">

5. A seed or private is generated in the form of 12 secret words.
    <img src="https://github.com/tearust/gluon-app/blob/main/public/images/polkadot-seed-private-key.png" width="320" height="400">

6. Once the registration portal appears, select <Allow use on any chain>, set account name and password.
    <img src="https://github.com/tearust/gluon-app/blob/main/public/images/polkadot-registration-form.png" width="320" height="400">

7. Check for successful installation as illustrated below
    <img src="https://github.com/tearust/gluon-app/blob/main/public/images/polkadot-registration-success.png" width="320" height="400">

8. To run WebApp, reference the Standard Setup Instruction above. Access WebApp at [http://localhost:3000/](http://127.0.0.1:3000/)
   &nbsp;
   &nbsp;

9. Navigate to profile tab and select Polkadot account from the dropdown
    <img src="https://github.com/tearust/gluon-app/blob/main/public/images/web-select-account.png" width="850" height="350">
    <img src="https://github.com/tearust/gluon-app/blob/main/public/images/select-gluon-account.png" width="850" height="425">

6. Top up adds 1000 units to balance by clicking top-up button.
    <img src="https://github.com/tearust/gluon-app/blob/main/public/images/web-select-account.png" width="850" height="425">

7. Run mobile application following run instructions in the Standard Setup Instructions section.

8. Navigate to profile tab on the mobile app.

9. Access LAYER1 ACCOUNT

10. TOP UP adds 1000 units to balance

11. On the WebApp profile page, select BIND MOBILE
    <img src="https://github.com/tearust/gluon-app/blob/main/public/images/web-select-account.png" width="850" height="425">
12. QR code is generated
    <img src="https://github.com/tearust/gluon-app/blob/main/public/images/qr-code.png" width="850" height="425">
13. On MobileApp, navigate to PAIR INFO in Profile tab

14. Scan QR code and click Pair Device button
