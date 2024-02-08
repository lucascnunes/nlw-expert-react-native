import { View, Text, FlatList, TouchableOpacity, Alert, Linking } from "react-native"
import { useRouter } from "expo-router"
import { Feather } from "@expo/vector-icons"

import { Header } from "@/components/header"
import { Product } from "@/components/product"
import { Button } from "@/components/button"

import { formatCurrency } from "@/utils/functions/format-currency"

import { useUserStore } from "@/stores/user-store"
import { ProductCartProps, useCartStore } from "@/stores/cart-store"

const STORE_PHONE = `TELEFONE_DA_LOJA`

export default function Cart() {
    const cartStore = useCartStore()
    const userStore = useUserStore()
    const user = userStore.user
    const router = useRouter()

    const products = cartStore.products

    const total = formatCurrency(products.reduce((total, product) => total + product.price * product.quantity, 0))

    function handleRemoveFromCart(product: ProductCartProps) {

        Alert.alert("Remover produto", `Deseja remover ${product.title} do carrinho?`, [
            {
                text: "Cancelar",
                style: "cancel"
            },
            {
                text: "Remover",
                onPress: () => {
                    cartStore.remove(product)
                }
            }
        ])
    }

    function handleOrder() {
        Alert.alert("Finalizar pedido", "Deseja finalizar o pedido?", [
            {
                text: "Cancelar",
                style: "cancel"
            },
            {
                text: "Finalizar",
                onPress: () => {

                    const products = cartStore.products.map(
                        (product) => `\n ${product.quantity}x ${product.title}`
                    ).join("")

                    const message = `🍔 NOVO PEDIDO 🍔
                        \n Entrega para ${user.name}
                        \n Endereço: ${user.address}
                        \n Telefone para contato: ${user.phone}
                        \n Produtos: ${products}
                        \n Valor total: ${total}
                    `
                    cartStore.clear()
                    Linking.openURL(`http://api.whatsapp.com/send?phone=${STORE_PHONE}&text=${message}`)
                    router.push('/')
                }
            }
        ])
    }

    return (
        <View className="flex-1 pt-8">
            <Header title={products.length === 0 ? "Seu carrinho" : `Seu carrinho (${products.length})`} />

            <FlatList 
                keyExtractor={(product) => product.id}
                renderItem={({ item }) => <Product key={item.id} data={item} onPress={() => handleRemoveFromCart(item)} />}
                scrollEnabled={true}
                showsVerticalScrollIndicator={true}
                data={products} className="p-5 flex-1" 
                ListEmptyComponent={() => <Text className="text-slate-400 text-base font-body my-8 text-center"> Seu carrinho está vazio </Text>}
            />

            <View className="flex-row gap-2 items-center mt-5 justify-center">
                <Text className="text-white text-xl font-subtitle">Total:</Text>
                <Text className="text-lime-400 text-2xl font-heading">{total}</Text>
            </View>

            <View>
                <TouchableOpacity onPress={() => router.push('/')} activeOpacity={0.7} className=" py-5">
                    <Text className="text-base text-white text-center font-body">{products.length === 0 ?"Voltar para o cardápio" : "Continuar comprando"}</Text>
                </TouchableOpacity>

                {products.length > 0 && (
                    <>
                        { (user.name.trim().length > 0 && user.email.trim().length > 0 && user.phone.trim().length > 0 && user.address.trim().length > 0) ? (
                            <Button onPress={handleOrder}>
                                <Button.Icon>
                                    <Feather name="credit-card" size={20} />
                                </Button.Icon>
                                <Button.Text>
                                    Ir para o pagamento
                                </Button.Text>
                            </Button>
                        ) : (
                            <Button onPress={() => router.push('/user')}>
                                <Button.Icon>
                                    <Feather name="user" size={20} />
                                </Button.Icon>
                                <Button.Text>
                                    Preencher seus dados
                                </Button.Text>
                            </Button> 
                        )}
                    </>
                )}
            </View>
        </View>
    )
}