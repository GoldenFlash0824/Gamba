import React, {Component} from 'react'
import 'react-native-gesture-handler'
import {View, Text, SafeAreaView} from 'react-native'
import {StripeProvider} from '@stripe/stripe-react-native'
import {Provider} from 'react-redux'
import Navigation from './src/navigation'
import store from './src/services/store/stores'
import {STRIPE_P_KEY} from './src/utils/helpers'
export default function App() {
    return (
        <Provider store={store}>
            <SafeAreaView style={{flex: 1}}>
                <StripeProvider
                    publishableKey={STRIPE_P_KEY}
                    urlScheme="your-url-scheme" // required for 3D Secure and bank redirects
                    merchantIdentifier="merchant.com.{{YOUR_APP_NAME}}" // required for Apple Pay
                >
                    <Navigation />
                </StripeProvider>
            </SafeAreaView>
        </Provider>
    )
}
