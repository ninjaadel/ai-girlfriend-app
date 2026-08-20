import { MaxContentWidth } from "@/constants/theme";
import { Background } from "expo-router/build/react-navigation";
import { useRef, useState } from "react";

import {
  StyleSheet, // 👈 'react-native' içerisinden süslü parantezle alındığından emin olun
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";

const API_URL = process.env.EXPO_PUBLİC_URL as string;

interface Message {
  id: string;
  content: string;
  role: "user" | "asistant";
}

export default function Index() {
  const [messages, setMessages] = useState<Message[]>([
    { id: "1", content: "selam günün nasıl geçiyor", role: "asistant" },
  ]);
  const [input, setInput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const flatListRef = useRef<FlatList>(null);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
    };
    const updateMessages = [...messages, userMsg];
    setMessages(updateMessages);
    setInput("");
    setLoading(true);

    try {
      const historyToSend = updateMessages.map((m) => ({
        role: m.role,
        content: m.content,
      }));
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: historyToSend }),
      });
      const data = await res.json();
      if (data.response) {
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            role: "asistant",
            content: data.response,
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            role: "asistant",
            content: "Bir aksilik oldu galiba... 😅",
          },
        ]);
      }
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "asistant",
          content: "suncuya bağlanamıyor... 😅" + error,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }: { item: Message }) => (
    <View
      style={[
        styles.messageBooble,
        item.role === "user" ? styles.userBooble : styles.aiBubble,
      ]}
    >
      <Text style={styles.messageText}>{item.content}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a1a",
  },

  messageBooble: {
    maxWidth: "80%",
    padding: 20,
    borderRadius: 16,
    marginVertical: 4,
  },
  userBooble: {
    alignSelf: "flex-end",
    backgroundColor: "#ff4b72",
    borderBottomLeftRadius: 2,
  },
  aiBubble: {
    alignSelf: "flex-start",
    backgroundColor: "#2b2b2b",
    borderBottomRightRadius: 2,
  },
  messageText: {
    fontSize: 15,
    color: "#fff",
    lineHeight: 20,
  },
});
