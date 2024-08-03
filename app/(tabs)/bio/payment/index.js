/*const Flutterwave = require('flutterwave-node-v3');
const User = require('../../../models/User');
require('dotenv').config();

const flw = new Flutterwave(process.env.FLW_PUBLIC_KEY, process.env.FLW_SECRET_KEY);

async function handlePayment(userId, amount) {
    try {
        const payload = {
            tx_ref: "MC-" + Date.now(),
            amount: amount,
            currency: "NGN",
            redirect_url: "http://your-callback-url.com",
            payment_options: "card",
            customer: {
                email: "user@example.com",
                phonenumber: "080****4528",
                name: "Yemi Desola",
            },
            customizations: {
                title: "Coin Top-up",
                description: "Top up your wallet with coins",
                logo: "http://www.piedpiper.com/app/themes/joystick-v27/images/logo.png",
            },
        };

        const response = await flw.Payment.create(payload);
        if (response.status === 'success') {
            return response.data.link;
        } else {
            throw new Error('Payment initialization failed');
        }
    } catch (error) {
        console.error(error);
        throw error;
    }
}

async function verifyPayment(transactionId) {
    try {
        const response = await flw.Transaction.verify({ id: transactionId });
        if (response.status === 'success' && response.data.status === 'successful') {
            const amountPaid = response.data.amount;
            const coinsToCredit = (amountPaid / 300) * 100;

            const user = await User.findById(response.data.customer.id);
            if (!user) {
                throw new Error('User not found');
            }

            user.wallet += coinsToCredit;
            await user.save();

            return { success: true, message: 'Wallet updated successfully' };
        } else {
            throw new Error('Payment verification failed');
        }
    } catch (error) {
        console.error(error);
        throw error;
    }
}

module.exports = { handlePayment, verifyPayment };*/
import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Pressable } from 'react-native';

export default function App() {
  const [selectedPayment, setSelectedPayment] = useState(null);

  const handlePaymentSelection = (paymentOption) => {
    setSelectedPayment(paymentOption);
  };

  const renderPaymentOptions = () => {
    if (selectedPayment === null) {
      return (
        <>
          <Pressable
            style={styles.paymentOption}
            onPress={() => handlePaymentSelection('paypal')}
          >
            <Text>PayPal</Text>
          </Pressable>
          <Pressable
            style={styles.paymentOption}
            onPress={() => handlePaymentSelection('credit_card')}
          >
            <Text>Credit Card</Text>
          </Pressable>
          <Pressable
            style={styles.paymentOption}
            onPress={() => handlePaymentSelection('debit_card')}
          >
            <Text>Debit Card</Text>
          </Pressable>
        </>
      );
    } else {
      return (
        <Pressable
          style={styles.proceedButton}
          onPress={() => {
            // Proceed with the selected payment method
            console.log(`Payment method selected: ${selectedPayment}`);
          }}
        >
          <Text>Proceed with {selectedPayment}</Text>
        </Pressable>
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text>Payment</Text>
      {renderPaymentOptions()}
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '900',
    fontSize: 45,
  },
  paymentOption: {
    marginVertical: 16,
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#ccc',
  },
  proceedButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: 'purple',
    borderRadius: 5,
    color: "white"
  },
});
