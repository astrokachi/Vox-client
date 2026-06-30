import { useEffect, useRef, useState } from "react";
import { getSocket } from "~/services/socket";
import type { Message } from "~/types";

interface UseConversationSocketOptions {
  conversationId: string;
  onMessageReceived?: (message: Message) => void;
  onMessageRefined?: (payload: { parentId: string; message: Message }) => void;
}

interface UseConversationSocketReturn {
  isTyping: boolean;
  error: string | null;
}

export function useConversationSocket({
  conversationId,
  onMessageReceived,
  onMessageRefined,
}: UseConversationSocketOptions): UseConversationSocketReturn {
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onReceivedRef = useRef(onMessageReceived);
  const onRefinedRef = useRef(onMessageRefined);
  onReceivedRef.current = onMessageReceived;
  onRefinedRef.current = onMessageRefined;

  useEffect(() => {
    if (!conversationId) return;
    const socket = getSocket();
    if (!socket) return;

    socket.emit("conversation:join", conversationId);

    const handleReceived = (message: Message) => {
      setIsTyping(false);
      onReceivedRef.current?.(message);
    };

    const handleRefined = (payload: { parentId: string; message: Message }) => {
      setIsTyping(false);
      onRefinedRef.current?.(payload);
    };

    const handleTyping = (payload: { conversationId: string }) => {
      if (payload.conversationId === conversationId) setIsTyping(true);
    };

    const handleError = (payload: {
      conversationId: string;
      error: string;
    }) => {
      if (payload.conversationId !== conversationId) {
        console.warn("Socket: Conversation id doesn't match");
        return;
      }
      setIsTyping(false);
      setError(payload.error);
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

  return { isTyping, error };
}
