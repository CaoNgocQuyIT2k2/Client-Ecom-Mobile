import React, { useState } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native'
import { Ionicons, MaterialIcons } from '@expo/vector-icons'

const EditProfileScreen = () => {
  const [name, setName] = useState('Darlene Robertson')
  const [email, setEmail] = useState('darlenrobertson@mail.com')
  const [phone, setPhone] = useState('+38 0123456789')
  const [password, setPassword] = useState('Chicago, USA')

  return (
    <View style={styles.container}>
      {/* Nút Back */}
      <TouchableOpacity style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>

      {/* Tiêu đề */}
      <Text style={styles.title}>Edit Profile</Text>

      {/* Ảnh đại diện */}
      <View style={styles.avatarContainer}>
        <Image
          source={{
            uri: 'https://randomuser.me/api/portraits/women/44.jpg', // Ảnh tạm
          }}
          style={styles.avatar}
        />
        <TouchableOpacity style={styles.editIcon}>
          <MaterialIcons name="edit" size={20} color="white" />
        </TouchableOpacity>
      </View>

      {/* Form nhập thông tin */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>NAME</Text>
        <View style={styles.inputRow}>
          <TextInput style={styles.input} value={name} onChangeText={setName} />
          <Ionicons name="checkmark-circle" size={20} color="green" />
        </View>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>EMAIL</Text>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
          <Ionicons name="checkmark-circle" size={20} color="green" />
        </View>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>PHONE NUMBER</Text>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />
          <Ionicons name="checkmark-circle" size={20} color="green" />
        </View>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>PASSWORD</Text>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={true} // Hiển thị dấu chấm thay vì chữ cái
          />
          <Ionicons name="checkmark-circle" size={20} color="green" />
        </View>
      </View>

      {/* Nút Save Changes */}
      <TouchableOpacity style={styles.saveButton}>
        <Text style={styles.saveButtonText}>SAVE CHANGES</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 40,
    marginBottom: 20,
  },
  avatarContainer: {
    alignSelf: 'center',
    position: 'relative',
    marginBottom: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  editIcon: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: 'black',
    borderRadius: 10,
    padding: 4,
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 12,
    color: 'gray',
    marginBottom: 5,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
    paddingBottom: 5,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: 'black',
  },
  saveButton: {
    backgroundColor: 'green',
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
})

export default EditProfileScreen
