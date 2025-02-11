'use client'; // Indica que este componente se ejecuta en el cliente

import React, { useState } from 'react';

// Interfaz para los mensajes
interface Message {
  role: 'user' | 'assistant'; // Puede ser "user" o "assistant"
  content: string; // Contenido del mensaje
}

export default function ChatBot() {
  const [input, setInput] = useState(''); // Mensaje del usuario
  const [messages, setMessages] = useState<Message[]>([]); // Historial de mensajes (con tipo explícito)
  const [loading, setLoading] = useState(false); // Estado de carga

  // Función para manejar el envío del mensaje
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Agrega el mensaje del usuario al historial
    const newMessage: Message = { role: 'user', content: input };
    setMessages((prev) => [...prev, newMessage]); // Solo agrega el mensaje del usuario aquí
    setInput('');

    // Muestra el estado de carga
    setLoading(true);

    try {
      // Envía el historial completo al backend
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, newMessage] }),
      });

      if (!res.ok) {
        throw new Error('Error al generar la respuesta');
      }

      const data = await res.json();

      // Agrega SOLO la respuesta del asistente al historial
      const assistantMessage: Message = { role: 'assistant', content: data.result };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      {/* Título personalizado */}
      <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>Chat proporcionado por Zeroaplus</h1>

      {/* Contenedor de mensajes */}
      <div style={{ border: '1px solid #ccc', padding: '10px', maxHeight: '400px', overflowY: 'auto', marginBottom: '10px' }}>
        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              margin: '10px 0',
              padding: '10px',
              borderRadius: '5px',
              backgroundColor: msg.role === 'user' ? '#f0f0f0' : '#d1e7dd',
              alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
            }}
          >
            {msg.content}
          </div>
        ))}
      </div>

      {/* Formulario de entrada */}
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px' }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Escribe un mensaje..."
          style={{ flex: 1, padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
        />
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '10px 20px',
            borderRadius: '5px',
            backgroundColor: loading ? '#ccc' : '#007bff',
            color: '#fff',
            border: 'none',
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          {loading ? 'Cargando...' : 'Enviar'}
        </button>
      </form>

      {/* Información de contacto */}
      <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px', color: '#666' }}>
        Para más información, contactar con{' '}
        <a href="mailto:info@zeroaplus.com" style={{ color: '#007bff', textDecoration: 'none' }}>
          info@zeroaplus.com
        </a>
      </p>
    </div>
  );
}