import ChatBot from '../chat/ChatBot';
import { Navigate } from 'react-router-dom';

const ChatBotPage = () => {
  if (sessionStorage.getItem('chatbot-client-submitted') !== 'true') {
    return <Navigate to="/" replace />;
  }

  return (
    <div>
        <ChatBot />
    </div>
  )
}

export default ChatBotPage
