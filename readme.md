# GLUON
As part of the TEA project, the end goal of Gluon is to serve as a replacement for traditional hardware crypto wallets. GLUON pertains to the category: Trust-as-a-Service, relying on distributed storage and execution in TEA nodes to elevate security.

For further details please refer to [gluon-docs](https://github.com/tearust/gluon-docs/tree/master/Blog_and_Vlog)

This repo contains runtimes for the GLUON web-app and mobile-app.  

For a video walkthrough, reference:  [![](https://github.com/tearust/gluon-app/blob/main/public/images/gluon-demo.png)](https://www.youtube.com/watch?v=wV4Q1-wTvFE)


## Standard Setup Instructions

### GLUON-WEBAPP

#### Run in local
```
cd webapp
npm i
npm start
```

If need to change the layer1 service url, please edit webapp/.env.dapp
```
NODE_ENV = dapp

#VUE_APP_LAYER1_URL=ws://139.198.187.91:9944
#VUE_APP_LAYER1_HTTP=http://139.198.187.91:9933

VUE_APP_LAYER1_URL=ws://64.227.49.206:9944
VUE_APP_LAYER1_HTTP=http://64.227.49.206:9933
```

Click [http://127.0.0.1:3000/](http://127.0.0.1:3000/) to visit.
Notice that make sure the node version greater than 14.

More details [visit](./webapp/readme.md).

-----


### GLUON-MOBILE-APP

[Download ios app](http://d.zqapps.com/m63e)

If you need download app to test, please find your iphone UDID and email it to liyangwood@gmail.com.
We can add your device to test list and reply to you. After that please download app from above url to test.

[This is how to grab the UDID](https://www.sourcefuse.com/blog/how-to-find-udid-in-the-new-iphone-xs-iphone-xr-and-iphone-xs-max/)

We will deploy the ios mobile app to Test-Flight in weeks.

#### Run in local with xcode and simulaor
```
cd mobile
npm i
cd ios
pod install
```

* Open mobile/ios/mobile.xcworkspace with XCode.
* Run it with iOS simulator.

More details [visit](./mobile/readme.md).

#### Test with Android
[Download Android App](http://d.firim.pro/trdf)


### Online Layer1 Service
We deploy 2 layer1 service online for test.
- ws://139.198.187.91:9944 (China Mainland)
- ws://64.227.49.206:9944 (US)


### Test webapp in Local with docker.
```
docker-compose up -d
```



## Walkthrough and Instructions
### Basic UI Walkthrough
1. To install the Polkadot{.js} browser extension, please refer to the links below. Available on both Google Chrome and Firefox
   - Download the Chrome extension [here](https://chrome.google.com/webstore/detail/polkadot%7Bjs%7D-extension/mopnmbcafieddcagagdcbnhejhlodfdd/related)  
   <img src="https://github.com/tearust/gluon-app/blob/main/public/images/chrome-extension-install.png" width="700" height="140">


   - Download the Firefox extension [here](https://addons.mozilla.org/en-US/firefox/addon/polkadot-js-extension/)  
   <img src="https://github.com/tearust/gluon-app/blob/main/public/images/firefox-extension-install.png" width="450" height="140">  

2. To check for successful installation, please reference the examples below:
   - Chrome  
   <img src="https://github.com/tearust/gluon-app/blob/main/public/images/chrome-extension-success.png" width="320" height="350">

   - Firefox  
   <img src="https://github.com/tearust/gluon-app/blob/main/public/images/firefox-extension-sucess.png" width="320" height="160">

3. To create polkadot account, navigate to the extension pop up and click the add button:  

    <img src="https://github.com/tearust/gluon-app/blob/main/public/images/polkadot-add-account.png" width="320" height="400">  

4. A seed or private is generated in the form of 12 secret words.  

    <img src="https://github.com/tearust/gluon-app/blob/main/public/images/polkadot-seed-private-key.png" width="320" height="400">  

5. Once the registration portal appears, select <Allow use on any chain>, set account name and password.  

    <img src="https://github.com/tearust/gluon-app/blob/main/public/images/polkadot-registration-form.png" width="320" height="400">  

6. Check for successful installation as illustrated below  
    <img src="https://github.com/tearust/gluon-app/blob/main/public/images/polkadot-registration-success.png" width="320" height="400">  

7. To run WebApp, reference the Standard Setup Instruction above. Access WebApp at [http://localhost:3000/](http://127.0.0.1:3000/)  

8. Navigate to profile tab and select Polkadot account from the dropdown  
    <img src="https://github.com/tearust/gluon-app/blob/main/public/images/web-select-account.png" width="850" height="350">  
    <img src="https://github.com/tearust/gluon-app/blob/main/public/images/select-gluon-account.png" width="800" height="390">  

9. Top up adds 1000 TEA coins to balance by clicking top-up button.  
    <img src="https://github.com/tearust/gluon-app/blob/main/public/images/top-up-web.png" width="850" height="425">  

10. Run mobile application following run instructions in the Standard Setup Instructions section.  

11. Navigate to profile tab on the mobile app.  
    <img src="https://github.com/tearust/gluon-app/blob/main/public/images/top-up-web.png" width="850" height="425">
12. Access LAYER1 ACCOUNT  
    <img src="https://github.com/tearust/gluon-app/blob/main/public/images/profile-tab-mobile.png" width="300" height="600">  
13. TOP UP adds 1000 TEA coins to balance  
    <img src="https://github.com/tearust/gluon-app/blob/main/public/images/layer-one-mobile.png" width="300" height="600">  
14. On the WebApp profile page, select BIND MOBILE  
    <img src="https://github.com/tearust/gluon-app/blob/main/public/images/web-select-account.png" width="850" height="390">  

15. QR code is generated  
    <img src="https://github.com/tearust/gluon-app/blob/main/public/images/qr-code.png" width="700" height="410">  

16. On MobileApp, navigate to PAIR INFO in Profile tab  

17. Scan QR code and click Pair Device button  
    <img src="https://github.com/tearust/gluon-app/blob/main/public/images/scan-qr-mobile.png" width="300" height="600">  
    <img src="https://github.com/tearust/gluon-app/blob/main/public/images/pair-device-mobile.png" width="300" height="600">  
