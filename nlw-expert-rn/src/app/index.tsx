import { useRef, useState } from 'react'
import { View, FlatList, SectionList, Text } from 'react-native'
import { Link } from 'expo-router'
import { CATEGORIES, MENU } from '@/utils/data/products'

import { Header } from '@/components/header'
import { CategoryButton } from '@/components/category-button'
import { Product } from '@/components/product'

export default function Home() {
    const [category, setCategory] = useState('Lanche do dia')

    const sectionListRef = useRef<SectionList>(null)

    function handleCategorySelected(selection: string) {
        setCategory(selection)
        const sectionIndex = CATEGORIES.findIndex((item) => item === selection)
        if (sectionListRef.current) {
           sectionListRef.current.scrollToLocation({
                animated: true,
                sectionIndex,
                itemIndex: 0
           }) 
        }
    }

    return (
    <View className="flex-1 pt-8">
        <Header title="Faça seu pedido" cartQuantityItems={5}/>

        <FlatList
            data={CATEGORIES}
            keyExtractor={(item) => item}
            renderItem={({ item }) => <CategoryButton title={item} isSelected={category === item} onPress={() => handleCategorySelected(item)} />}
            horizontal
            className="h-20 mt-5"
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 12, paddingHorizontal: 20 }}
        />

        <SectionList 
            ref={sectionListRef}
            sections={MENU}
            keyExtractor={(item) => item.id}
            stickySectionHeadersEnabled={false}
            renderItem={({ item }) => (
                <Link href={`/product/${item.id}`} asChild><Product data={item} /></Link>
            )}
            renderSectionHeader={({ section: { title } }) => (
                <Text className="text-white text-xl font-heading font-bold mt-4 mb-3">{title}</Text>
            )}
            className="px-5"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 100 }}
        />

    </View>
    )
}
