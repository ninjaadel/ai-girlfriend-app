import React, { useRef, useState } from "react";
import {
  StyleSheet,
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

const API_URL =
  process.env.EXPO_PUBLIC_API_URL || "http://192.168.1.102:8000/api/chat";

export default function Index() {
  const [messages, setMessages] = useState([
    { id: "1", content: "selam günün nasıl geçiyor", role: "assistant" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const flatListRef = useRef(null);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMsg = {
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
            role: "assistant",
            content: data.response,
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            role: "assistant",
            content: "Bir aksilik oldu galiba... 😅",
          },
        ]);
      }
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "Sunucuya bağlanılamıyor... 😅",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => (
    <View
      style={[
        styles.messageBooble,
        item.role === "user" ? styles.userBooble : styles.aiBubble,
      ]}
    >
      <Text style={styles.messageText}>{item.content}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header Alanı */}
      <View style={styles.headers}>
        <Text style={styles.avatar}>💖</Text>
        <View>
          <Text style={styles.headerTitle}>AI GirlFriend</Text>
          <Text style={styles.status}>Çevrimiçi</Text>
        </View>
      </View>

      {/* Mesaj Sohbet Alanı */}
      <KeyboardAvoidingView
        style={styles.chatArea}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 10 : 0}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          onContentSizeChange={() =>
            flatListRef.current?.scrollToEnd({ animated: true })
          }
        />

        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color="#ff4b72" />
            <Text style={styles.loadingText}> Yazıyor...</Text>
          </View>
        )}

        {/* Mesaj Girdisi */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Mesajını yaz..."
            placeholderTextColor="#888"
            value={input}
            onChangeText={setInput}
          />
          <TouchableOpacity
            style={styles.sendButton}
            onPress={sendMessage}
            disabled={loading}
          >
            <Text style={styles.sendButtonText}>Gönder</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a1a",
  },
  headers: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ff4b72",
    padding: 16,
    paddingTop: Platform.OS === "android" ? 40 : 16,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  status: { color: "#ffe0e6", fontSize: 12 },
  avatar: { fontSize: 28, marginRight: 12 },
  chatArea: {
    flex: 1,
  },
  listContent: {
    padding: 16,
    gap: 10,
  },
  messageBooble: {
    maxWidth: "80%",
    padding: 14,
    borderRadius: 16,
    marginVertical: 4,
  },
  userBooble: {
    alignSelf: "flex-end",
    backgroundColor: "#ff4b72",
    borderBottomRightRadius: 2,
  },
  aiBubble: {
    alignSelf: "flex-start",
    backgroundColor: "#2b2b2b",
    borderBottomLeftRadius: 2,
  },
  messageText: {
    fontSize: 15,
    color: "#fff",
    lineHeight: 20,
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  loadingText: {
    color: "#888",
    fontStyle: "italic",
  },
  inputContainer: {
    flexDirection: "row",
    padding: 12,
    paddingBottom: Platform.OS === "android" ? 28 : 12, // 👈 Alt gezinti tuşları için alan açar
    backgroundColor: "#242424",
    alignItems: "center",
  },
  input: {
    flex: 1,
    backgroundColor: "#1a1a1a",
    color: "#fff",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#333",
  },
  sendButton: {
    backgroundColor: "#ff4b72",
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 20,
  },
  sendButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
