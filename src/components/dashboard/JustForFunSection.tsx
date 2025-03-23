
import React, { useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tv, MessageSquare, Award, CheckCircle } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

export default function JustForFunSection() {
  const [activeCardId, setActiveCardId] = useState<number | null>(null);
  const [textInputs, setTextInputs] = useState<Record<number, string>>({});
  const { toast } = useToast();
  
  const funItems = [
    {
      id: 1,
      title: "What's a TV show you've enjoyed recently?",
      type: "chat",
      icon: Tv,
      bgColor: "bg-bittersweet/10",
      iconColor: "text-bittersweet",
      size: "small"
    },
    {
      id: 3,
      title: "What stood out about onboarding yesterday?",
      type: "chat",
      icon: MessageSquare,
      bgColor: "bg-sagebright-green/10",
      iconColor: "text-sagebright-green",
      size: "small"
    },
    {
      id: 4,
      title: "Which of your teammates is an Eagle Scout?",
      type: "multiple-choice",
      icon: Award,
      bgColor: "bg-sunglow/10",
      iconColor: "text-sunglow",
      size: "small",
      choices: ["John Smith", "Maria Garcia", "Alex Johnson", "Taylor Wu"],
      correctAnswer: "Alex Johnson"
    }
  ];

  const handleCardClick = (id: number) => {
    setActiveCardId(activeCardId === id ? null : id);
  };

  const handleTextChange = (id: number, text: string) => {
    setTextInputs({
      ...textInputs,
      [id]: text
    });
  };

  const handleTextSubmit = (id: number) => {
    const item = funItems.find(item => item.id === id);
    if (!item) return;

    // Show confirmation toast for chat submissions
    toast({
      title: "Response Submitted",
      description: `Thanks for sharing! I'll keep that in mind about ${item.title.toLowerCase().replace(/\?$/, '')}.`,
      duration: 5000,
    });

    // Reset UI
    setActiveCardId(null);
    setTextInputs({
      ...textInputs,
      [id]: ""
    });
  };

  const handleMultipleChoiceSubmit = (id: number, choice: string) => {
    const item = funItems.find(item => item.id === id);
    if (!item || !('correctAnswer' in item)) return;

    const isCorrect = choice === item.correctAnswer;
    
    // Show correct/incorrect toast
    toast({
      title: isCorrect ? "Correct Answer!" : "Not quite right",
      description: isCorrect 
        ? `${choice} is indeed an Eagle Scout!` 
        : `The correct answer is ${item.correctAnswer}.`,
      duration: 5000,
      variant: isCorrect ? "default" : "destructive",
    });

    // Reset UI
    setActiveCardId(null);
  };

  return (
    <div className="space-y-5">
      <h2 className="text-xl font-helvetica font-bold text-charcoal">Just for Fun</h2>
      
      <Separator className="bg-sagebright-accent/20" />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {funItems.map((item) => (
          <Card 
            key={item.id} 
            className="bg-white hover:shadow-card-hover transition-shadow rounded-2xl border border-gray-100 shadow-card flex flex-col justify-between"
          >
            <CardContent className="p-6">
              <div className={`${item.bgColor} p-3 rounded-full w-fit mb-4`}>
                <item.icon className={`h-5 w-5 ${item.iconColor}`} />
              </div>
              <h3 className="font-helvetica font-medium text-lg text-charcoal">{item.title}</h3>
            </CardContent>
            
            <CardFooter className="px-6 pb-6 pt-0">
              {activeCardId === item.id ? (
                <div className="w-full">
                  {item.type === "chat" ? (
                    <div className="space-y-3">
                      <textarea 
                        className="w-full p-3 border rounded-xl h-24 text-sm font-roboto border-sagebright-green/30 focus:border-sagebright-green outline-none" 
                        placeholder="Type your response here..."
                        value={textInputs[item.id] || ""}
                        onChange={(e) => handleTextChange(item.id, e.target.value)}
                      />
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setActiveCardId(null)}
                          className="border-sagebright-green/30 text-charcoal hover:bg-sagebright-green/10"
                        >
                          Cancel
                        </Button>
                        <Button 
                          size="sm"
                          className="bg-sagebright-green hover:bg-sagebright-green/90 text-white"
                          onClick={() => handleTextSubmit(item.id)}
                          disabled={!textInputs[item.id]?.trim()}
                        >
                          Submit
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3 w-full">
                      {item.choices?.map((choice, index) => (
                        <button
                          key={index}
                          className="w-full text-left p-3 border rounded-xl hover:bg-sagebright-green/5 text-sm font-roboto border-sagebright-green/30"
                          onClick={() => handleMultipleChoiceSubmit(item.id, choice)}
                        >
                          {String.fromCharCode(65 + index)}. {choice}
                        </button>
                      ))}
                      <div className="flex justify-end">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setActiveCardId(null)}
                          className="border-sagebright-green/30 text-charcoal hover:bg-sagebright-green/10"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Button 
                  variant="outline"
                  className="w-full border-sagebright-green/30 text-charcoal hover:bg-sagebright-green/10"
                  onClick={() => handleCardClick(item.id)}
                >
                  Click to Answer
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
