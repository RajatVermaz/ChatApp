import React, { useState, useEffect } from 'react';
import { Button, Form } from 'react-bootstrap';
import io from 'socket.io-client';

const socket = io('http://localhost:5000');
function ChatApp() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [typingUser, setTypingUser] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    socket.on('message', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });
    socket.on('typing', (user) => {
      setTypingUser(user);
    });
    return () => {
      socket.off('message');
    };
  }, [socket]);

  const sendMessage = (event) => {
    event.preventDefault();
    socket.emit('message', message);
    setMessage('');
  };

  return (
    <div>
      <h1>Simple Chat</h1>
      <div>
        {messages.map((message, index) => (
          <p key={index}>{message}</p>
        ))}
      </div>
      <Form onSubmit={sendMessage}>
        <Form.Group className="d-flex" controlId="formBasicEmail">
          <Form.Control
            className="me-3 "
            type="text"
            value={message}
            placeholder="Write something..."
            onChange={(event) => {
              setMessage(event.target.value);
              socket.emit('typing');
            }}
          />

          <Button variant="primary" type="submit">
            Send
          </Button>
        </Form.Group>
        {typingUser && <p>{typingUser} is typing...</p>}
      </Form>
    </div>
  );
}

export default ChatApp;
