import React, { useState, useRef, useEffect } from 'react';

const AIBot = () => {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hi! I am your AI Assistant for Iconic Interior. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [suggestedQuestions, setSuggestedQuestions] = useState([
    "What are the pricing plans?",
    "How do credits work?",
    "Tell me about HD rendering",
    "How to contact support?"
  ]);
  const [currentCategory, setCurrentCategory] = useState('initial');
  const messagesEndRef = useRef(null);

  const allPossibleQuestions = [
    "What are the pricing plans?",
    "How do credits work?",
    "Tell me about HD rendering",
    "How to contact support?",
    "Difference between STANDARD and PRO?",
    "Is there a free trial?",
    "How to upgrade my plan?",
    "Show all features",
    "How to get more credits?",
    "Do credits expire?",
    "Difference between AI and Manual credits?",
    "What is 2D/3D Floor Planner?",
    "Tell me about Furniture Catalog",
    "Is HD rendering included in all plans?",
    "How to report a bug?",
    "Can I get a refund?",
    "Where is my project history?",
    "Back to main menu",
    "Back to pricing"
  ];

  const conversationFlow = {
    initial: [
      "What are the pricing plans?",
      "How do credits work?",
      "Tell me about HD rendering",
      "How to contact support?"
    ],
    pricing: [
      "Difference between STANDARD and PRO?",
      "Is there a free trial?",
      "How to upgrade my plan?",
      "Show all features"
    ],
    credits: [
      "How to get more credits?",
      "Do credits expire?",
      "Difference between AI and Manual credits?",
      "Back to main menu"
    ],
    features: [
      "What is 2D/3D Floor Planner?",
      "Tell me about Furniture Catalog",
      "Is HD rendering included in all plans?",
      "Back to pricing"
    ],
    support: [
      "How to report a bug?",
      "Can I get a refund?",
      "Where is my project history?",
      "Back to main menu"
    ]
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle input change and filter questions
  const handleInputChange = (e) => {
    const value = e.target.value;
    setInput(value);

    if (value.trim() === "") {
      // If input is empty, show current category questions
      setSuggestedQuestions(conversationFlow[currentCategory]);
    } else {
      // Filter from all possible questions based on typing
      const filtered = allPossibleQuestions.filter(q => 
        q.toLowerCase().includes(value.toLowerCase())
      );
      // Show top 5 matches
      setSuggestedQuestions(filtered.slice(0, 5));
    }
  };

  const handleSend = async (e, text = null) => {
    if (e) e.preventDefault();
    const messageText = text || input;
    if (!messageText.trim()) return;

    const userMessage = { role: 'user', content: messageText };
    setMessages(prev => [...prev, userMessage]);
    if (!text) setInput('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      let botResponse = "";
      let nextCategory = 'initial';
      const lowerInput = messageText.toLowerCase();
      
      if (lowerInput.includes('price') || lowerInput.includes('plan') || lowerInput.includes('tariff')) {
        botResponse = "We offer three plans: FREE (Basic features), STANDARD (Unlimited credits), and PRO (Everything + HD Rendering). Which one would you like to know more about?";
        nextCategory = 'pricing';
      } else if (lowerInput.includes('credit')) {
        botResponse = "Credits are essential for generating designs. FREE users get 3 credits, while paid plans have unlimited credits for both AI and Manual designs.";
        nextCategory = 'credits';
      } else if (lowerInput.includes('hd rendering') || lowerInput.includes('feature') || lowerInput.includes('floor planner')) {
        botResponse = "Our features include 2D/3D Floor Planning, AI Interior Design, and Premium Furniture Catalogs. HD Rendering is our top-tier feature for realistic designs.";
        nextCategory = 'features';
      } else if (lowerInput.includes('support') || lowerInput.includes('contact') || lowerInput.includes('help') || lowerInput.includes('refund') || lowerInput.includes('bug')) {
        botResponse = "You can contact our support team via the Contact Us page or email support@iconicinterior.com. We usually respond within 24 hours.";
        nextCategory = 'support';
      } else if (lowerInput.includes('standard') && lowerInput.includes('pro')) {
        botResponse = "The main difference is HD Rendering and Premium support. PRO also includes advanced material selections and priority processing.";
        nextCategory = 'pricing';
      } else if (lowerInput.includes('cancel')) {
        botResponse = "Subscriptions can be cancelled anytime from your profile settings. Your benefits will continue until the end of the current billing cycle.";
        nextCategory = 'support';
      } else if (lowerInput.includes('main menu') || lowerInput.includes('back')) {
        botResponse = "Sure! What else can I help you with? You can ask about prices, credits, or features.";
        nextCategory = 'initial';
      } else {
        botResponse = "I'm here to help! You can ask me about our pricing, how credits work, or the advanced features like HD rendering.";
        nextCategory = 'initial';
      }

      setMessages(prev => [...prev, { role: 'assistant', content: botResponse }]);
      setSuggestedQuestions(conversationFlow[nextCategory]);
      setCurrentCategory(nextCategory);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <div className="ai-bot-section">
      <style>{`
        .ai-bot-section {
          background: #73c2fb;
          padding: 80px 0;
          color: white;
          font-family: 'Inter', sans-serif;
        }

        .bot-container {
          max-width: 800px;
          margin: 0 auto;
          padding: 0 20px;
        }

        .bot-title {
          text-align: center;
          font-size: 48px;
          margin-bottom: 40px;
          font-weight: 400;
          letter-spacing: 1px;
        }

        .chat-window {
          background: white;
          border-radius: 20px;
          box-shadow: 0 15px 35px rgba(0,0,0,0.1);
          height: 500px;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          color: #333;
        }

        .chat-messages {
          flex: 1;
          padding: 20px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .suggested-options {
          display: flex;
          flex-wrap: nowrap;
          gap: 10px;
          padding: 0 20px 15px;
          overflow-x: auto;
          scrollbar-width: none; /* Firefox */
        }

        .suggested-options::-webkit-scrollbar {
          display: none; /* Chrome/Safari */
        }

        .option-chip {
          background: #e3f2fd;
          color: #2196f3;
          border: 1px solid #bbdefb;
          padding: 8px 15px;
          border-radius: 20px;
          font-size: 13px;
          cursor: pointer;
          transition: all 0.3s ease;
          white-space: nowrap;
          flex-shrink: 0;
        }

        .option-chip:hover {
          background: #2196f3;
          color: white;
          border-color: #2196f3;
        }

        .message {
          max-width: 80%;
          padding: 12px 18px;
          border-radius: 15px;
          font-size: 15px;
          line-height: 1.5;
        }

        .message.assistant {
          align-self: flex-start;
          background: #f0f2f5;
          color: #333;
          border-bottom-left-radius: 2px;
        }

        .message.user {
          align-self: flex-end;
          background: #2196f3;
          color: white;
          border-bottom-right-radius: 2px;
        }

        .typing-indicator {
          font-size: 12px;
          color: #888;
          margin-bottom: 5px;
          padding-left: 5px;
        }

        .chat-input-area {
          padding: 20px;
          border-top: 1px solid #eee;
          display: flex;
          gap: 10px;
        }

        .chat-input {
          flex: 1;
          border: 1px solid #ddd;
          padding: 12px 20px;
          border-radius: 25px;
          outline: none;
          font-size: 15px;
          transition: border-color 0.3s;
        }

        .chat-input:focus {
          border-color: #2196f3;
        }

        .send-btn {
          background: #2196f3;
          color: white;
          border: none;
          padding: 0 25px;
          border-radius: 25px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.3s;
        }

        .send-btn:hover {
          background: #1976d2;
        }

        /* Scrollbar styling */
        .chat-messages::-webkit-scrollbar {
          width: 6px;
        }
        .chat-messages::-webkit-scrollbar-track {
          background: #f1f1f1;
        }
        .chat-messages::-webkit-scrollbar-thumb {
          background: #ccc;
          border-radius: 10px;
        }
      `}</style>

      <div className="bot-container">
        <h2 className="bot-title">AI BOT</h2>
        <div className="chat-window">
          <div className="chat-messages">
            {messages.map((msg, index) => (
              <div key={index} className={`message ${msg.role}`}>
                {msg.content}
              </div>
            ))}
            {isTyping && <div className="typing-indicator">AI is thinking...</div>}
            <div ref={messagesEndRef} />
          </div>
          <div className="suggested-options">
            {suggestedQuestions.map((q, index) => (
              <button 
                key={index} 
                className="option-chip"
                onClick={() => handleSend(null, q)}
              >
                {q}
              </button>
            ))}
          </div>
          <form className="chat-input-area" onSubmit={handleSend}>
            <input 
              type="text" 
              className="chat-input" 
              placeholder="Ask anything about our services..."
              value={input}
              onChange={handleInputChange}
            />
            <button type="submit" className="send-btn">Send</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AIBot;
