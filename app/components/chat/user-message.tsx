interface UserMessageProps {
  content: string;
}

const UserMessage = ({ content }: UserMessageProps) => {
  return (
    <div className="user-message">
      <div className="message-bubble">
        {content}
      </div>
    </div>
  );
};

export default UserMessage;
