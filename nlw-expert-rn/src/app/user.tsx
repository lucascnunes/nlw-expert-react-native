import { useState, useRef } from "react"
import { View, Text, ScrollView, Alert } from "react-native"
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { Feather } from "@expo/vector-icons"

import { Header } from "@/components/header"
import { Button } from "@/components/button"
import { Input } from "@/components/input"

import { useCartStore } from "@/stores/cart-store"
import { useUserStore } from "@/stores/user-store"
import { useRouter } from "expo-router"

export default function User() {
    const cartStore = useCartStore()
    const userStore = useUserStore()
    const user = userStore.user
    const router = useRouter()

    const [name, setName] = useState(user.name)
    const [email, setEmail] = useState(user.email)
    const emailRef = useRef()
    const [phone, setPhone] = useState(user.phone)
    const phoneRef = useRef()
    const [address, setAddress] = useState(user.address)
    const addressRef = useRef()

    function handleSaveProfile() {
        if (name.trim().length === 0 || email.trim().length === 0 || phone.trim().length === 0 || address.trim().length === 0) {
            return Alert.alert('Erro', 'Preencha todos os dados para salvar seu perfil')
        }

        userStore.save({ name, email, phone, address })
        
        Alert.alert('Obrigado', 'Seu perfil foi salvo com sucesso', [
            {
                text: cartStore.products.length > 0 ? 'Ir para carrinho' : 'Ir para o cardápio',
                onPress: () => {
                    if (cartStore.products.length > 0) {
                        router.push('/cart')
                    } else {
                        router.push('/')
                    }
                }
            }
        ])
    }

    return (
        <View className="flex-1 pt-8">
            <Header title="Seu perfil" cartQuantityItems={cartStore.products.length} />
            
            <KeyboardAwareScrollView>
                <ScrollView>
                    <Text className="text-white text-sm font-body my-8 text-center"> {user.name.trim().length > 0 || user.email.trim().length > 0 || user.phone.trim().length > 0 || user.address.trim().length > 0 ? 'Mantenha seus dados atualizados' : 'Preencha todos os dados para salvar seu perfil'} </Text>

                    <View className="mt-10 px-5 gap-4">
                        <Input placeholder="Nome" onChangeText={setName} value={name} autoFocus={name.trim().length === 0} blurOnSubmit returnKeyType="next" />
                        <Input placeholder="E-mail" onChangeText={setEmail} value={email} keyboardType="email-address" autoFocus={email.trim().length === 0} blurOnSubmit returnKeyType="next" />
                        <Input placeholder="Telefone" onChangeText={setPhone} value={phone} keyboardType="phone-pad" autoFocus={phone.trim().length === 0} blurOnSubmit returnKeyType="next" />
                        <Input placeholder="Endereço completo" multiline style={{height: 200}} textAlignVertical="top" onChangeText={setAddress} value={address} autoFocus={address.trim().length === 0} onSubmitEditing={handleSaveProfile} blurOnSubmit returnKeyType="done" />
                    </View>
                </ScrollView>
            </KeyboardAwareScrollView>

            <View>
                <Button onPress={handleSaveProfile}>
                    <Button.Icon>
                        <Feather name="save" size={20} />
                    </Button.Icon>
                    <Button.Text>Salvar</Button.Text>
                </Button>
            </View>
        </View>
    )
}