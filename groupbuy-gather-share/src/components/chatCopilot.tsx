import { useState } from 'react';
import axios from 'axios';

const ChatCopilot = () => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState<{ role: string; content: string }[]>([]);

  const handleSend = async () => {
    if (!message.trim()) return;

    const newChat = [...chat, { role: 'user', content: message }];
    setChat(newChat);
    setMessage('');

    try {
      const res = await axios.post('http://localhost:5000/api/copilot', {
        messages: newChat,
      });
      setChat([...newChat, { role: 'assistant', content: res.data.reply }]);
    } catch {
      setChat([...newChat, { role: 'assistant', content: '❌ Erreur de réponse du copilote.' }]);
    }
  };

  return (
    <div style={{ position: 'fixed', bottom: 20, right: 20, zIndex: 999 }}>
      {open ? (
        <div style={{
          backgroundColor: '#fff',
          border: '1px solid #ccc',
          borderRadius: 8,
          width: 320,
          padding: 12,
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <strong>🤖 Copilot GroupBuy</strong>
            <button onClick={() => setOpen(false)} style={{ border: 'none', background: 'none' }}>✖</button>
          </div>
          <div style={{ height: 220, overflowY: 'auto', border: '1px solid #eee', padding: 8, marginBottom: 8 }}>
            {chat.map((msg, idx) => (
              <div key={idx} style={{ marginBottom: 6 }}>
                <strong>{msg.role === 'user' ? 'Vous' : 'Copilot'} :</strong>
                <div>{msg.content}</div>
              </div>
            ))}
          </div>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Posez une question..."
            style={{
              width: '100%',
              padding: 8,
              marginBottom: 6,
              border: '1px solid #ccc',
              borderRadius: 4
            }}
          />
          <button
            onClick={handleSend}
            style={{
              width: '100%',
              backgroundColor: '#007bff',
              color: '#fff',
              border: 'none',
              padding: 8,
              borderRadius: 4
            }}
          >
            Envoyer
          </button>
        </div>
      ) : (
        <button
          onClick={() => setOpen(true)}
          style={{
            width: 60,
            height: 60,
            borderRadius: '50%',
            backgroundColor: '#007bff',
            color: '#fff',
            fontSize: 24,
            border: 'none',
            boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
          }}
        >
          🤖
        </button>
      )}
    </div>
  );
};

export default ChatCopilot;
