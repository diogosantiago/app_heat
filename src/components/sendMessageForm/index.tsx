import React, { useEffect, useState } from "react";
import { View, TextInput, Alert, Keyboard } from "react-native";
import { styles } from "./styles";
import { Button } from "../button";
import { COLORS } from "../../theme";
import { api } from "../../services/api";

export function SendMessageForm(){
    const [message, setMessage] = useState('');
    const [sendingMessage, setSendingMessage] = useState(false);

    async function handleMessageSubmit(){
        const messageFormatted = message.trim()
        if(messageFormatted.length){
            setSendingMessage(true);
            try{
                const response = await api.post('messages', {
                    message: messageFormatted
                })
                setMessage('');
                Keyboard.dismiss()
                Alert.alert("Mensagem enviada com sucesso!")
            }
            catch(error){
                console.log(error);
            }
            setSendingMessage(false);
        }
        else{
            Alert.alert("Mensagem precisa ter conteudo!")
        }
    }

    return (
        <View style={styles.container}>
            <TextInput
                keyboardAppearance="dark"
                placeholder="Qual a sua expectativa para o evento?"
                placeholderTextColor={COLORS.GRAY_PRIMARY}
                multiline
                maxLength={140}
                style={styles.input}
                value={message}
                onChangeText={setMessage}
                editable={!sendingMessage}
            />
            <Button
                title="ENVIAR MENSAGEM"
                color={COLORS.WHITE}
                backgroundColor={COLORS.PINK}
                isLoading={sendingMessage}
                onPress={handleMessageSubmit}
            />
        </View>
    )
}