import React from "react";
import { Text, TouchableOpacity, ColorValue, TouchableOpacityProps, ActivityIndicator } from "react-native";
import { styles } from "./styles";
import {AntDesign} from "@expo/vector-icons";

type ButtonProps = TouchableOpacityProps & {
    title: string;
    color: ColorValue;
    backgroundColor: ColorValue;
    icon?: React.ComponentProps<typeof AntDesign>['name'];
    isLoading?: boolean;
}

export function Button({ title, color, backgroundColor, icon, isLoading = false, ...rest }: ButtonProps){
    return (
        <TouchableOpacity
            style={[
                styles.container,
                {backgroundColor}
            ]}
            activeOpacity={0.7}
            disabled={isLoading}
            {...rest}
        >
            {
                isLoading?
                    <ActivityIndicator color={color} /> :
                    <>
                        <AntDesign name={icon} size={24} style={styles.icon} />
                        <Text style={[
                            styles.title,
                            { color }
                        ]}>{ title }</Text>
                    </>
            }
        </TouchableOpacity>
    )
}