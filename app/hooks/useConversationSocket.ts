import { useEffect, useRef, useState } from "react";
import { getSocket } from "~/services/socket";
import type { Message } from "~/types";

export interface MessageEvent {
  conversationId: string;
  messageGroupId: string;
  parentMessageId: string | null;
  message: Message;
}

// Sent once, after the backend has given up on a job (all retries failed).
export interface MessageErrorEvent {
  conversationId: string;
  messageGroupId: string;
  parentMessageId: string | null;
  error: string;
}

interface UseConversationSocketOptions {
  conversationId: string;
  onMessageReceived?: (payload: MessageEvent) => void;
  onMessageRefined?: (payload: MessageEvent) => void;
  onError?: (payload: MessageErrorEvent) => void;
}

interface UseConversationSocketReturn {
  isTyping: boolean;
  error: string | null;
  // When the last typing/received/refined event arrived (ms); 0 if none yet.
  lastActivity: number;
}

export function useConversationSocket({
  conversationId,
  onMessageReceived,
  onMessageRefined,
  onError,
}: UseConversationSocketOptions): UseConversationSocketReturn {
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastActivity, setLastActivity] = useState(0);

  const onReceivedRef = useRef(onMessageReceived);
  const onRefinedRef = useRef(onMessageRefined);
  const onErrorRef = useRef(onError);
  useEffect(() => {
    onReceivedRef.current = onMessageReceived;
    onRefinedRef.current = onMessageRefined;
    onErrorRef.current = onError;
  });

  useEffect(() => {
    if (!conversationId) return;
    const socket = getSocket();
    if (!socket) return;

    socket.emit("conversation:join", conversationId);

    const markActive = () => {
      setError(null);
      setLastActivity(Date.now());
    };

    const handleReceived = (payload: MessageEvent) => {
      setIsTyping(false);
      markActive();
      onReceivedRef.current?.(payload);
    };

    const handleRefined = (payload: MessageEvent) => {
      setIsTyping(false);
      markActive();
      onRefinedRef.current?.(payload);
    };

    const handleTyping = (payload: { conversationId: string }) => {
      if (payload.conversationId !== conversationId) return;
      setIsTyping(true);
      markActive();
    };

    const handleError = (payload: MessageErrorEvent) => {
      if (payload.conversationId !== conversationId) {
        console.warn("Socket: Conversation id doesn't match");
        return;
      }
      setIsTyping(false);
      setError(payload.error);
      onErrorRef.current?.(payload);
    };

    socket.on("message:received", handleReceived);
    socket.on("message:refined", handleRefined);
    socket.on("message:typing", handleTyping);
    socket.on("message:error", handleError);

    return () => {
      socket.emit("conversation:leave", conversationId);
      socket.off("message:received", handleReceived);
      socket.off("message:refined", handleRefined);
      socket.off("message:typing", handleTyping);
      socket.off("message:error", handleError);
    };
  }, [conversationId]);

  return { isTyping, error, lastActivity };
}
