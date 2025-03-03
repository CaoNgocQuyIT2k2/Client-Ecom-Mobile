import { StyleSheet, Text, TouchableOpacity, View, Alert } from 'react-native'
import React, { useState } from 'react'
import { Stack, router } from 'expo-router'
import InputField from '@/components/InputField'
import { Ionicons } from '@expo/vector-icons'
import { Colors } from '@/constants/Colors'
import { registerUser } from '@/services/authService'

const SignUpScreen = () => {
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleRegister = async () => {
    if (!email || !username || !password || !confirmPassword) {
      Alert.alert('Error', 'Please enter all required fields.')
      return
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match.')
      return
    }

    setLoading(true)

    try {
      const data = await registerUser(
        email,
        username,
        password,
        confirmPassword
      )
      console.log('📩 Registration successful, redirecting to OTP:', data)
      Alert.alert('Success', 'Please check your email for the OTP code.')

      // Navigate to the OTP verification screen
      router.push({ pathname: '/otpverify', params: { email } })
    } catch (error: any) {
      Alert.alert('Registration Error', error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Stack.Screen
        options={{ headerTitle: 'Sign Up', headerTitleAlign: 'center' }}
      />
      <View style={styles.container}>
        <Text style={styles.title}>Create an Account</Text>
        <InputField
          placeholder="Email Address"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
        <InputField
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
        />
        <InputField
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <InputField
          placeholder="Confirm Password"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
        <TouchableOpacity
          style={styles.btn}
          onPress={handleRegister}
          disabled={loading}
        >
          <Text style={styles.btnTxt}>
            {loading ? 'Signing up...' : 'Create Account'}
          </Text>
        </TouchableOpacity>
      </View>
    </>
  )
}

export default SignUpScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: Colors.background,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
    marginBottom: 50,
  },
  btn: {
    backgroundColor: Colors.primary,
    padding: 14,
    alignItems: 'center',
    borderRadius: 5,
    marginBottom: 20,
  },
  btnTxt: { color: Colors.white, fontSize: 16, fontWeight: '600' },
})
