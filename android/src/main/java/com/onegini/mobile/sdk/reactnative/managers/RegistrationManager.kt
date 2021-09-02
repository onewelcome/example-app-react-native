/*
 * Copyright (c) 2016-2018 Onegini B.V.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package com.onegini.mobile.sdk.reactnative.managers

import android.net.Uri
import com.onegini.mobile.sdk.reactnative.Constants.DEFAULT_SCOPES
import com.onegini.mobile.sdk.reactnative.OneginiSDK
import com.onegini.mobile.sdk.android.handlers.OneginiRegistrationHandler
import com.onegini.mobile.sdk.android.model.OneginiIdentityProvider
import com.onegini.mobile.sdk.reactnative.handlers.customregistration.SimpleCustomRegistrationAction

class RegistrationManager(private val oneginiSDK: OneginiSDK) {
    val redirectUri: String
        get() {
            val client = oneginiSDK.oneginiClient
            return client.configModel.redirectUri
        }

    fun registerUser(identityProvider: OneginiIdentityProvider?, registrationHandler: OneginiRegistrationHandler?) {
        val oneginiClient = oneginiSDK.oneginiClient
        oneginiClient.userClient.registerUser(identityProvider, DEFAULT_SCOPES, registrationHandler!!)
    }

    fun registerUser(id: String?, registrationHandler: OneginiRegistrationHandler?) {
        registerUser(getIdentityProvider(id), registrationHandler)
    }

    fun getIdentityProvider(id: String?): OneginiIdentityProvider? {
        for (identity in oneginiSDK.oneginiClient.userClient.identityProviders) {
            if (identity.id == id) {
                return identity
            }
        }
        return null
    }

    fun getSimpleCustomRegistrationAction(id: String?): SimpleCustomRegistrationAction? {
        for (action in oneginiSDK.simpleCustomRegistrationActions) {
            if (action.getIdProvider() == id) {
                return action
            }
        }
        return null
    }

    fun handleRegistrationCallback(uri: String?) {
        oneginiSDK.registrationRequestHandler.handleRegistrationCallback(Uri.parse(uri))
    }

    fun cancelRegistration() {
        oneginiSDK.registrationRequestHandler.onRegistrationCanceled()
    }
}