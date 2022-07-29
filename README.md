# example-app-react-native

The React Native Example App is using the [Onewelcome React Native SDK](https://github.com/onewelcome/sdk-react-native) to perform secure authentication and resource calls. 
## Getting started

1. `npm install` OR `yarn`

2. Make sure to folow the SDK Configuration and Resolving dependecies sections.
3. run `yarn android` or `yarn ios`
>**Note** iOS currently does not work natively with m1. You can run it under rosetta2 with `arch -x86_64 yarn ios` 

## SDK Configuration

1. Get access to https://repo.onegini.com/artifactory/onegini-sdk
2. Use https://github.com/Onegini/onegini-sdk-configurator on your application (instructions can be found there)


## Resolving dependencies (android)

Before you can compile the application it must be able to resolve it's dependencies. The Onegini Android SDK is one of those dependencies.
We have an Artifactory repository that distributes the required dependencies. Make sure that you have access to the Onegini Artifactory
repository (https://repo.onegini.com). If you don't have access, no problem just go to
the [App developer quickstart](https://docs.onegini.com/app-developer-quickstart.html#step1) and perform the first step. Access to
Artifactory is required to let Gradle download the Onegini Android SDK library.

When you have access you have to make sure that your Artifactory username and password are set in the `gradle.properties` file in your
Gradle user home
(e.g. ~/.gradle):

Example contents of the `gradle.properties` file in you Gradle user home:

```
artifactory_user=<username>
artifactory_password=<password>
```

See the documentation below for instructions on setting Gradle properties:
[https://docs.gradle.org/current/userguide/build_environment.html#sec:gradle_properties_and_system_properties](https://docs.gradle.org/current/userguide/build_environment.html#sec:gradle_properties_and_system_properties)



## Resolving dependencies (iOS)
### Setup access to the Onegini Cocoapods repository
The Example app includes the Onegini SDK as a Cocoapod. In order to let Cocoapods download it you need to setup your account details so the SDK can be
automatically downloaded:
1. Make sure that you have access to the Onegini Artifactory repository (https://repo.onegini.com). If not please follow first step of [App developer quickstart](https://docs.onegini.com/app-developer-quickstart.html).
2. Follow [Setting up the project guide](https://docs.onegini.com/ios-sdk/topics/setting-up-the-project.html#cocoapods) in the Onegini SDK documentation for
instructions on configuring access to the Onegini Cocoapods repository.

>**Note** Don't forget to update the Onegini Cocoapods repository with the following command: `pod repo-art update onegini`. If you don't update the repo it may
be that the SDK dependency cannot be found. If that is the case be sure to execute the command above.

### Setup the Cocoapods dependencies
1. Run `pod install` to correctly setup the Cocoapods dependencies
2. Make sure that you open the project referring to `RNExampleApp.xcworkspace` in Xcode or AppCode.

## Providing token server configuration
The example app is already configured with the token server out of the box for both Android and iOS. 


### Changing the configuration
If there is a need to change the token server configuration within the example app it is going to be best to do it using the Onegini SDK Configurator. Follow
the steps as described in: `https://github.com/onewelcome/sdk-configurator`

You will need to set the configuration seperately for iOS and Android.
