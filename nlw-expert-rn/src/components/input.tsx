import { TextInput, TextInputProps } from "react-native";
import colors from "tailwindcss/colors";

export function Input({...rest}: TextInputProps) {
    return (
        <TextInput 
            className="px-4 rounded-md bg-slate-800 py-3 font-body text-sm text-white" 
            placeholderTextColor={colors.slate[400]}
            {...rest} 
        />
    )
}