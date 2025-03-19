import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import MessageBubble from './MessageBubble';

const Chat = () => {
    const { token, user } = useAuth();
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const chatContainerRef = useRef(null);
    const API_URL = import.meta.env.VITE_API_URL;

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages]);

    const tryParseJSON = (text) => {
        try {
            const parsed = JSON.parse(text);
            if (parsed && parsed.content) {
                return parsed.content; // Retorna solo el contenido
            }
        } catch (e) {
            // No hacer nada, simplemente retornar el texto original si no es JSON válido
        }
        return text;
    };

    const sendMessage = async () => {
        if (!input.trim()) return;

        const userMessage = { role: 'user', content: input };
        setMessages((prevMessages) => [...prevMessages, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await fetch(`${API_URL}/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ message: input }),
            });

            if (!response.body) {
                throw new Error('Response body is empty');
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let assistantMessage = { role: 'assistant', content: '' };

            // Agrega el mensaje del asistente (inicialmente vacío)
            setMessages((prevMessages) => [...prevMessages, assistantMessage]);

            let partialMessage = '';
            const processStream = async () => {
                try {
                    while (true) {
                        const { done, value } = await reader.read();
                        if (done) {
                            break;
                        }

                        const chunk = decoder.decode(value);
                        partialMessage += chunk;

                        // Intentar parsear solo el primer objeto JSON completo
                        try {
                            const processedContent = tryParseJSON(partialMessage);

                            // Actualizar el mensaje del asistente con el contenido procesado
                            setMessages((prevMessages) => {
                                const updatedMessages = [...prevMessages];
                                const lastIndex = updatedMessages.length - 1;
                                //console.log('LastIndex', lastIndex)
                                updatedMessages[lastIndex] = {
                                    ...updatedMessages[lastIndex],
                                    content: updatedMessages[lastIndex].content + processedContent, // Anexa el nuevo token
                                };
                                return updatedMessages;
                            });

                            // Limpiar la variable temporal
                            partialMessage = '';
                        } catch (e) {
                           //console.error("Partial Message error", e)
                            // No hacer nada si no hay un objeto JSON completo, acumular más datos
                        }
                    }
                    setIsLoading(false);
                } catch (error) {
                    console.error('Error reading stream:', error);
                    setMessages((prevMessages) => [
                        ...prevMessages,
                        { role: 'assistant', content: 'Lo siento, ha ocurrido un error al procesar tu mensaje.' },
                    ]);
                    setIsLoading(false);
                } finally {
                    reader.releaseLock(); // Release the lock when done or on error
                }
            };

            processStream(); // Llama a la función processStream
        } catch (error) {
            console.error('Error sending message:', error);
            setMessages((prevMessages) => [
                ...prevMessages,
                { role: 'assistant', content: 'Lo siento, ha ocurrido un error al procesar tu mensaje.' },
            ]);
            setIsLoading(false);
        }
    };
    return (
        <div className="flex flex-col h-full bg-gray-100 p-4 rounded-lg shadow-md mx-auto lg:w-full "> {/* Elimina max-w-3xl, agrega lg:max-w-5xl */}
            {/* Botón de limpieza de conversación */}
            <div className="flex justify-end mb-2">
                <button
                    className="text-gray-500 hover:text-red-500 font-medium text-sm"
                    onClick={() => setMessages([])}
                >
                    Limpiar conversación
                </button>
            </div>

            <div
                ref={chatContainerRef}
                className="flex-grow overflow-y-auto overflow-x-auto p-4 bg-white rounded-lg max-w-100 lg:max-w-full"
                style={{ scrollBehavior: 'smooth' }}
            >
                {messages.length === 0 ? (
                    <div className="text-center text-gray-500 py-20">
                        <p className="text-xl mb-2">👋 ¡Bienvenido!</p>
                        <p>Envía un mensaje para comenzar la conversación.</p>
                    </div>
                ) : (
                    messages.map((message, index) => (
                        <MessageBubble key={index} message={message} />
                    ))
                )}
                {/* {isLoading && (
                    <div className="flex justify-start mb-2">
                        <div className="bg-gray-200 text-gray-900 p-3 rounded-lg shadow-md">
                            <div className className="font-medium mb-1">Asistente</div>
                            <div className="text-gray-500 italic animate-pulse">Escribiendo...</div>
                        </div>
                    </div>
                )} */}
            </div>
            <div className=''>
                <div className="p-4 border-t bg-gray-900 rounded-lg flex items-center mt-2 ">
                    <textarea
                        className="flex-grow border border-gray-300 text-white rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                        placeholder="Escribe tu mensaje..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                sendMessage();
                            }
                        }}
                        rows={1}
                        style={{ minHeight: '42px', maxHeight: '150px' }}
                    />
                    <button
                        className={`ml-2 ${isLoading || !input.trim()
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-blue-500 hover:bg-blue-700'
                            } text-white font-bold py-2 px-4 rounded-lg transition-all`}
                        onClick={sendMessage}
                        disabled={isLoading || !input.trim()}
                    >
                        {isLoading ? 'Enviando...' : 'Enviar'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Chat;