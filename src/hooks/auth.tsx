import React, { createContext, useContext, useEffect, useState } from "react";
import * as AuthSession from "expo-auth-session"
import { api } from "../services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

const CLIENT_ID = 'f7912275679d90a270cc';
// const SCOPE="user";
const SCOPE="read:user";
const USER_STORAGE = '@dowhile:user';
const TOKEN_STORAGE = '@dowhile:token';

type User = {
    id: string;
    avatar_url: string;
    name: string;
    login: string;
}

type AuthContextData = {
    user: User | null;
    isSignIn: boolean;
    signIn: () => Promise<void>,
    signOut: () => Promise<void>
}

type AuthProviderProps = {
    children: React.ReactNode;
}

type AuthResponse = {
    token: string;
    user: User;
}

type AuthorizationResponse = {
    params: {
        code?: string;
        error?: string;
    },
    type?: string;
}

export const AuthContext = createContext({} as AuthContextData);

function AuthProvider({children}: AuthProviderProps){
    const [isSignIn, setIsSignIn] = useState(true);
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        async function loadUserStorageData(){
            const tokenStorage = await AsyncStorage.getItem(TOKEN_STORAGE);
            const userStorage = await AsyncStorage.getItem(USER_STORAGE);

            if(tokenStorage && userStorage){
                api.defaults.headers.common['Authorization'] = `Bearer ${tokenStorage}`;
                setUser(JSON.parse(userStorage));
            }

            setIsSignIn(false);
        }
        loadUserStorageData();
    }, [])

    async function signIn(){
        setIsSignIn(true);
        try{
            const authUrl = `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&scope=${SCOPE}`;
            const authSessionResponse = await AuthSession.startAsync({authUrl}) as AuthorizationResponse;

            if(authSessionResponse.type == "success" && authSessionResponse.params.error != "access_denied"){
                const authResponse = await api.post('authenticate', {code: authSessionResponse.params.code});
                const {user, token} = authResponse.data as AuthResponse;

                await AsyncStorage.setItem(TOKEN_STORAGE, token);
                await AsyncStorage.setItem(USER_STORAGE, JSON.stringify(user));

                api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                setUser(user);
            }
        }
        catch(error){
            console.log(error);
        }
        setIsSignIn(false);
    }

    async function signOut(){
        setIsSignIn(true);

        await AsyncStorage.removeItem(TOKEN_STORAGE);
        await AsyncStorage.removeItem(USER_STORAGE);

        api.defaults.headers.common['Authorization'] = '';
        setUser(null);

        setIsSignIn(false);
    }

    return (
        <AuthContext.Provider value={{signIn, signOut, user, isSignIn}}>
            {children}
        </AuthContext.Provider>
    )
}

function useAuth(){
    const context = useContext(AuthContext);

    return context;
}

export { AuthProvider, useAuth }