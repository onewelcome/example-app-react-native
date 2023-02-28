package com.onegini.mobile.rnexampleapp;

import com.onegini.mobile.sdk.reactnative.model.rn.OneginiReactNativeConfig;
import com.onegini.mobile.sdk.reactnative.model.rn.ReactNativeIdentityProvider;

import java.util.Arrays;
import java.util.List;

public class ReactNativeConfig implements OneginiReactNativeConfig {

  public List<ReactNativeIdentityProvider> getIdentityProviders() {
    return Arrays.asList(
        new ReactNativeIdentityProvider("2-way-otp-api", true),
        new ReactNativeIdentityProvider("qr_registration", false));
  }
}
