import React, { useState, useCallback, useRef } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import { Ionicons, MaterialIcons } from '@expo/vector-icons'
import { useFocusEffect } from '@react-navigation/native'
import {
  fetchUserProfile,
  updateFullName,
  updateProfile,
  uploadAvatar,
} from '../services/userService'
import { router } from 'expo-router'

const EditProfileScreen = () => {
  // State lưu thông tin user
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('********') // Không cho sửa
  const [loading, setLoading] = useState(false)
  const [isEditingName, setIsEditingName] = useState(false)
  const [avatar, setAvatar] = useState(
    'https://randomuser.me/api/portraits/women/44.jpg'
  )

  // 🟢 Load dữ liệu user khi mở màn hình
  useFocusEffect(
    useCallback(() => {
      const loadUserData = async () => {
        try {
          setLoading(true)
          const userData = await fetchUserProfile()
          setName(userData.fullName || '')
          setEmail(userData.email || '')
          setPhone(userData.phone || '')
          setAvatar(
            userData.avatar ||
              'https://randomuser.me/api/portraits/women/44.jpg'
          )
        } catch (error) {
          console.error('❌ Lỗi khi load user:', error)
        } finally {
          setLoading(false)
        }
      }
      loadUserData()
    }, [])
  )

  // 🟢 Hàm yêu cầu quyền truy cập ảnh
  const requestPermissions = async (): Promise<boolean> => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
    if (status !== 'granted') {
      Alert.alert(
        'Quyền bị từ chối',
        'Ứng dụng cần quyền truy cập ảnh để thay đổi avatar.'
      )
      return false
    }
    return true
  }

  // 🟢 Hàm chọn ảnh và upload lên server
  const handleUploadAvatar = async () => {
    try {
      const hasPermission = await requestPermissions()
      if (!hasPermission) return

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1], // Cắt ảnh vuông
        quality: 0.5, // Giảm dung lượng ảnh
      })

      if (result.canceled === true) return // Người dùng hủy chọn ảnh

      // Lấy đường dẫn ảnh
      const localUri = result.assets[0].uri
      const filename = localUri.split('/').pop() || 'avatar.jpg'
      const match = /\.(\w+)$/.exec(filename)
      const type = match ? `image/${match[1]}` : `image`

      // Tạo FormData
      const formData = new FormData()
      formData.append('avatar', {
        uri: localUri,
        name: filename,
        type,
      } as any)

      setLoading(true)

      // Gọi API upload avatar
      const response = await uploadAvatar(formData)

      if (response.avatar) {
        setAvatar(response.avatar) // Cập nhật avatar
        Alert.alert('Thành công', 'Avatar đã được cập nhật!')
      } else {
        Alert.alert('Lỗi', 'Không thể cập nhật avatar.')
      }
    } catch (error) {
      console.error('❌ Lỗi khi upload avatar:', error)
      Alert.alert('Lỗi', 'Có lỗi xảy ra khi cập nhật avatar.')
    } finally {
      setLoading(false)
    }
  }

  const [originalName, setOriginalName] = useState('') // Lưu giá trị ban đầu của name
  const inputRef = useRef<TextInput>(null) // Dùng để focus vào input khi bấm bút chì

  // 🟢 Khi bấm vào bút chì
  const handleEditPress = () => {
    setOriginalName(name) // Lưu lại giá trị ban đầu
    setIsEditingName(true)
    setTimeout(() => inputRef.current?.focus(), 100) // Focus vào input sau khi bật chế độ chỉnh sửa
  }

  // 🟢 Khi thay đổi nội dung input
  const handleNameChange = (text: string) => {
    setName(text)
  }

  // 🟢 Khi bấm nút tick (lưu)
  const handleSavePress = async () => {
    if (name === originalName) return // Không thay đổi thì không làm gì cả

    try {
      setLoading(true)
      await updateFullName(name)
      Alert.alert('Thành công', 'Tên của bạn đã được cập nhật!')
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể cập nhật tên.')
    } finally {
      setLoading(false)
      setIsEditingName(false)
    }
  }

  return (
    <View style={styles.container}>
      {loading && <ActivityIndicator size="large" color="green" />}

      {/* Nút Back */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.push('/(tabs)/profile')}
      >
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>

      <Text style={styles.title}>Edit Profile</Text>

      {/* Ảnh đại diện */}
      <View style={styles.avatarContainer}>
        <Image source={{ uri: avatar }} style={styles.avatar} />
        <TouchableOpacity style={styles.editIcon} onPress={handleUploadAvatar}>
          <MaterialIcons name="edit" size={20} color="white" />
        </TouchableOpacity>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>NAME</Text>
        <View>
          <TextInput
            ref={inputRef} // Gán ref để focus tự động
            style={styles.input}
            value={name}
            onChangeText={handleNameChange}
            editable={isEditingName} // Chỉ cho phép nhập khi bấm vào bút chì
          />
          <TouchableOpacity
            onPress={isEditingName ? handleSavePress : handleEditPress}
            style={styles.editIconInput}
            disabled={isEditingName && name === originalName} // Vô hiệu hóa nút tick nếu không có thay đổi
          >
            <MaterialIcons
              name={isEditingName ? 'check' : 'edit'}
              size={20}
              color={
                isEditingName && name === originalName ? 'lightgray' : 'gray'
              }
            />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>EMAIL</Text>
        <View>
          <TextInput
            style={styles.input}
            value={email}
            keyboardType="email-address"
            editable={false} // Không cho nhập
            selectTextOnFocus={false} // Không cho chọn text khi bấm vào
          />
          <TouchableOpacity onPress={() => router.push("/changemail")} style={styles.editIconInput}>
            <MaterialIcons name="edit" size={20} color="gray" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>PHONE NUMBER</Text>
        <View>
          <TextInput
            style={styles.input}
            value={phone}
            keyboardType="phone-pad"
            editable={false}
            selectTextOnFocus={false}
          />
          <TouchableOpacity onPress={() => router.push("/changephone")} style={styles.editIconInput}>
            <MaterialIcons name="edit" size={20} color="gray" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>PASSWORD</Text>
        <View>
          <TextInput
            style={styles.input}
            value={password}
            secureTextEntry={true}
            editable={false}
            selectTextOnFocus={false}
          />
          <TouchableOpacity  onPress={() => router.push("/changepassword")}  style={styles.editIconInput}>
            <MaterialIcons name="edit" size={20} color="gray" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20 },
  backButton: {
    position: 'absolute',
    top: 65,
    left: 20,
    zIndex: 10,
  },

  editIconInput: {
    position: 'absolute',
    right: 5, // Đặt icon sát phải
  },

  input1: {
    flex: 1, // Đảm bảo input mở rộng hết chiều ngang
    paddingRight: 35, // Tạo khoảng trống để không bị icon đè lên chữ
  },

  editIconInput1: {
    position: 'absolute',
    right: 5, // Đặt icon sát mép phải
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
  avatar: { width: 100, height: 100, borderRadius: 50 },
  editIcon: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: 'black',
    borderRadius: 10,
    padding: 4,
  },
  inputContainer: { marginBottom: 15 },
  label: { fontSize: 12, color: 'gray', marginBottom: 5 },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
    fontSize: 16,
    color: 'black',
    paddingBottom: 5,
  },
  saveButton: {
    backgroundColor: 'green',
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
})

export default EditProfileScreen
