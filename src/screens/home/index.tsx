import React from "react";
import { KeyboardAvoidingView, View, Platform } from "react-native";
import { Header } from "../../components/header";
import { MessageList } from "../../components/messageList";
import { SendMessageForm } from "../../components/sendMessageForm";
import { SignInBox } from "../../components/signInBox";
import { useAuth } from "../../hooks/auth";
import { styles } from "./styles";

export function Home(){
    const {user} = useAuth();

    return (
        <KeyboardAvoidingView
            style={{flex: 1}}
            behavior={Platform.OS === "ios"? "padding" : undefined}
        >
            <View style={styles.container}>
                <Header />
                <MessageList />
                {user? <SendMessageForm /> : <SignInBox />}
            </View>
        </KeyboardAvoidingView>
    )
}