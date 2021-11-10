import React, { useEffect, useState } from "react";
import { ScrollView } from "react-native";
import { styles } from "./styles";
import { Message, MessageProps } from "../message";
import { api } from "../../services/api";
import {io} from "socket.io-client"
import {MESSAGES_EXAMPLE} from "../../../utils/messages"

const socket = io(String(api.defaults.baseURL))
socket.on('new_message', (newMessage) => {
    messageQueue.push(newMessage);
})

// let messageQueue: MessageProps[] = [];
let messageQueue: MessageProps[] = MESSAGES_EXAMPLE;

export function MessageList(){
    const [messageList, setMessageList] = useState<MessageProps[]>([]);

    useEffect(() => {
        async function loadMessageList(){
            const currentMessage = await api.get<MessageProps[]>('messages/last3');
            if(currentMessage?.data){
                setMessageList(currentMessage.data);
            }
        }
        loadMessageList();
    }, [])

    useEffect(() => {
        const timer = setInterval(() => {
            if(messageQueue.length){
                const queue = messageQueue.shift() as MessageProps
                setMessageList(oldMessageList => [queue, ...oldMessageList])
            }
        }, 3*1000)
        // clearInterval(timer);
    }, [])

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.content}
            keyboardShouldPersistTaps="never"
        >
            {
                messageList.map(message => <Message key={message.id} data={message} />)
            }
        </ScrollView>
    )
}