import { useState, useEffect, useRef } from 'react';
import { 
  Bot, 
  X, 
  Send, 
  Mic, 
  MicOff, 
  Sparkles 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  options?: string[];
}

const AIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Welcome! How can I help you analyze your investment opportunities today?",
      sender: 'bot',
      timestamp: new Date(),
      options: [
        "Compare all available ICDs",
        "Show me bonds with the highest interest rate"
      ]
    }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSendMessage = (text: string = inputValue.trim()) => {
    if (!text) return;
    
    // Add user message
    const newUserMessage: Message = {
      id: messages.length + 1,
      text: text,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages([...messages, newUserMessage]);
    setInputValue('');
    
    // Simulate bot response after a short delay
    setTimeout(() => {
      const botResponse = getBotResponse(text);
      setMessages(prev => [...prev, botResponse]);
    }, 1000);
  };

  const handleOptionClick = (option: string) => {
    handleSendMessage(option);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      // Simulate stopping recording and getting transcript
      setIsRecording(false);
      setTimeout(() => {
        setInputValue("Show me my latest ICD investments");
      }, 1000);
    } else {
      // Simulate starting recording
      setIsRecording(true);
      setInputValue("");
      
      // Simulate stopping after 3 seconds
      setTimeout(() => {
        setIsRecording(false);
        setInputValue("Show me my latest ICD investments");
      }, 3000);
    }
  };

  // Scripted responses for the AI assistant
  const getBotResponse = (input: string): Message => {
    // Compare all available ICDs
    if (input.toLowerCase().includes('compare all available icd')) {
      return {
        id: messages.length + 2,
        text: "Here is a comparison of available Inter-Corporate Deposits:\n\n" +
              "• Alpha Manufacturing Ltd.: 8.75% for 90 days\n" +
              "• Beta Technologies Inc.: 9.00% for 180 days\n" +
              "• Gamma Healthcare Services: 8.50% for 60 days\n" +
              "• Delta Energy Solutions: 9.25% for 120 days\n\n" +
              "Would you like more details on any specific ICD?",
        sender: 'bot',
        timestamp: new Date(),
        options: [
          "Tell me more about Alpha Manufacturing",
          "Tell me more about Beta Technologies",
          "Compare risk profiles"
        ]
      };
    }
    
    // Show bonds with highest interest rate
    if (input.toLowerCase().includes('show me bonds with the highest interest rate')) {
      return {
        id: messages.length + 2,
        text: "Here are the bonds with the highest interest rates:\n\n" +
              "1. Theta Financial Services: 9.10% for 48 months\n" +
              "2. Sigma Power Corporation: 8.75% for 60 months\n" +
              "3. Omega Infrastructure Ltd.: 8.25% for 36 months\n\n" +
              "Would you like to know more about any of these bonds?",
        sender: 'bot',
        timestamp: new Date(),
        options: [
          "Tell me about Theta Financial",
          "Compare bond yields",
          "Show me bond investment risks"
        ]
      };
    }

    // Alpha Manufacturing details
    if (input.toLowerCase().includes('alpha manufacturing')) {
      return {
        id: messages.length + 2,
        text: "Alpha Manufacturing Ltd. ICD Details:\n\n" +
              "• Interest Rate: 8.75%\n" +
              "• Tenure: 90 days\n" +
              "• Minimum Investment: $200,000\n" +
              "• Credit Rating: AAA\n" +
              "• Sector: Manufacturing\n\n" +
              "Alpha Manufacturing is a well-established company with a 15-year track record of consistent profitability. Their financials show a debt-to-equity ratio of 0.4 and interest coverage ratio of 8.5, indicating strong financial health.",
        sender: 'bot',
        timestamp: new Date(),
        options: [
          "How do I invest in this ICD?",
          "Show me other options"
        ]
      };
    }

    // Beta Technologies details
    if (input.toLowerCase().includes('beta technologies')) {
      return {
        id: messages.length + 2,
        text: "Beta Technologies Inc. ICD Details:\n\n" +
              "• Interest Rate: 9.00%\n" +
              "• Tenure: 180 days\n" +
              "• Minimum Investment: $500,000\n" +
              "• Credit Rating: AA+\n" +
              "• Sector: Technology\n\n" +
              "Beta Technologies specializes in enterprise software solutions with a strong recurring revenue model. They have shown 22% year-over-year growth and maintain healthy cash reserves of $150M.",
        sender: 'bot',
        timestamp: new Date(),
        options: [
          "How do I invest in this ICD?",
          "Show me other options"
        ]
      };
    }

    // Compare risk profiles
    if (input.toLowerCase().includes('compare risk profiles')) {
      return {
        id: messages.length + 2,
        text: "Risk Profile Comparison:\n\n" +
              "• Alpha Manufacturing (AAA): Lowest risk, strong balance sheet, diversified customer base\n" +
              "• Beta Technologies (AA+): Low-moderate risk, tech sector volatility partially offset by recurring revenue\n" +
              "• Gamma Healthcare (AA): Low-moderate risk, stable sector with government contracts\n" +
              "• Delta Energy (A+): Moderate risk, higher returns due to project-based revenue model\n\n" +
              "Based on your portfolio, adding Alpha Manufacturing or Gamma Healthcare would provide better diversification.",
        sender: 'bot',
        timestamp: new Date(),
        options: [
          "Recommend an allocation strategy",
          "Show me investment process"
        ]
      };
    }

    // Theta Financial details
    if (input.toLowerCase().includes('theta financial')) {
      return {
        id: messages.length + 2,
        text: "Theta Financial Services Bond Details:\n\n" +
              "• Interest Rate: 9.10%\n" +
              "• Tenure: 48 months\n" +
              "• Minimum Investment: $150,000\n" +
              "• Payment Frequency: Monthly\n" +
              "• Credit Rating: AA-\n\n" +
              "Theta Financial Services is a mid-sized NBFC with a focus on small business lending. Their bond offers the highest yield due to their specialized market segment and monthly interest payouts.",
        sender: 'bot',
        timestamp: new Date(),
        options: [
          "What are the risks?",
          "How do I invest in this bond?"
        ]
      };
    }

    // Compare bond yields
    if (input.toLowerCase().includes('compare bond yields')) {
      return {
        id: messages.length + 2,
        text: "Bond Yield Comparison (Annual):\n\n" +
              "• Theta Financial Services: 9.10% (monthly payout)\n" +
              "• Sigma Power Corporation: 8.75% (quarterly payout)\n" +
              "• Omega Infrastructure Ltd.: 8.25% (semi-annual payout)\n\n" +
              "When accounting for compounding effects, Theta's effective yield is 9.43% assuming reinvestment at the same rate.",
        sender: 'bot',
        timestamp: new Date(),
        options: [
          "Show me tax implications",
          "Compare with government bonds"
        ]
      };
    }

    // Bond investment risks
    if (input.toLowerCase().includes('bond investment risks')) {
      return {
        id: messages.length + 2,
        text: "Key Bond Investment Risks:\n\n" +
              "• Interest Rate Risk: Bond values decrease when market rates rise\n" +
              "• Credit Risk: Possibility of default by the issuer\n" +
              "• Liquidity Risk: Difficulty selling bonds before maturity\n" +
              "• Inflation Risk: Fixed returns may not keep pace with inflation\n\n" +
              "Among your options, Theta Financial has the highest credit risk but compensates with higher yield, while Omega has the lowest overall risk profile.",
        sender: 'bot',
        timestamp: new Date(),
        options: [
          "How to mitigate these risks?",
          "Show me recommended allocation"
        ]
      };
    }

    // How to invest
    if (input.toLowerCase().includes('how do i invest')) {
      return {
        id: messages.length + 2,
        text: "Investment Process:\n\n" +
              "1. Click 'View Details' on the investment card\n" +
              "2. Review the complete terms and documentation\n" +
              "3. Click 'Invest Now' to proceed\n" +
              "4. Enter your investment amount\n" +
              "5. Confirm your investment\n\n" +
              "Note: For demonstration purposes, all fund transfers are simulated and would be handled via a secure, external process in a production environment.",
        sender: 'bot',
        timestamp: new Date(),
        options: [
          "Show me available investments",
          "Tell me about investment limits"
        ]
      };
    }

    // Default responses
    if (input.toLowerCase().includes('hello') || input.toLowerCase().includes('hi')) {
      return {
        id: messages.length + 2,
        text: "Hello! How can I assist you with your investments today?",
        sender: 'bot',
        timestamp: new Date(),
        options: [
          "Compare all available ICDs",
          "Show me bonds with the highest interest rate",
          "Analyze my portfolio"
        ]
      };
    }
    
    if (input.toLowerCase().includes('icd') || input.toLowerCase().includes('deposit')) {
      return {
        id: messages.length + 2,
        text: "Your latest ICD investment was made on July 25, 2025 for $1,000,000 at 8.75% for 90 days. It will mature on October 28, 2025. Would you like to see more details or explore new ICD opportunities?",
        sender: 'bot',
        timestamp: new Date(),
        options: [
          "Show me new ICD opportunities",
          "Calculate my expected returns"
        ]
      };
    }
    
    return {
      id: messages.length + 2,
      text: "I'm not sure I understand your question. Would you like to know about your ICDs, bonds, portfolio performance, or current market trends?",
      sender: 'bot',
      timestamp: new Date(),
      options: [
        "Compare all available ICDs",
        "Show me bonds with the highest interest rate",
        "Analyze my portfolio"
      ]
    };
  };

  return (
    <>
      {/* AI Assistant Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button 
          onClick={() => setIsOpen(!isOpen)} 
          className={`rounded-full p-3 h-14 w-14 shadow-lg ${
            isOpen ? 'bg-muted hover:bg-muted/90' : 'bg-primary hover:bg-primary/90'
          }`}
        >
          {isOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Bot className="h-6 w-6" />
          )}
        </Button>
      </div>
      
      {/* AI Assistant Panel */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-80 sm:w-96 z-50 shadow-2xl rounded-xl overflow-hidden">
          <Card className="border-t-2 border-t-primary">
            <div className="bg-primary text-primary-foreground p-4">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                <h3 className="font-medium">Elevate AI Assistant</h3>
              </div>
            </div>
            
            <CardContent className="p-0">
              {/* Messages Container */}
              <div className="h-96 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div 
                    key={message.id} 
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div 
                      className={`max-w-[80%] rounded-xl p-3 ${
                        message.sender === 'user' 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-muted'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-line">{message.text}</p>
                      <p className="text-xs mt-1 opacity-70">
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                      
                      {/* Clickable options */}
                      {message.options && message.options.length > 0 && (
                        <div className="mt-3 space-y-2">
                          {message.options.map((option, index) => (
                            <button
                              key={index}
                              onClick={() => handleOptionClick(option)}
                              className="w-full text-left text-xs p-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-md transition-colors"
                            >
                              {option}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
              
              {/* Input Area */}
              <div className="p-4 border-t">
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className={`rounded-full ${isRecording ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90' : ''}`}
                    onClick={toggleRecording}
                  >
                    {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                  </Button>
                  
                  <Input
                    placeholder={isRecording ? "Listening..." : "Ask about your investments..."}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    disabled={isRecording}
                    className="rounded-full"
                  />
                  
                  <Button
                    type="button"
                    className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 p-2"
                    onClick={() => handleSendMessage()}
                    disabled={!inputValue.trim()}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
                
                {isRecording && (
                  <div className="flex justify-center mt-2">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-destructive rounded-full animate-pulse"></div>
                      <div className="w-2 h-2 bg-destructive rounded-full animate-pulse delay-150"></div>
                      <div className="w-2 h-2 bg-destructive rounded-full animate-pulse delay-300"></div>
                      <span className="text-xs text-muted-foreground ml-1">Recording...</span>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};

export default AIAssistant;