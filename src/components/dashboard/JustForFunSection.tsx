
import React, { useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tv, MessageSquare, Award } from "lucide-react";
import { cn } from "@/lib/utils";

export default function JustForFunSection() {
  const [activeCardId, setActiveCardId] = useState<number | null>(null);
  
  const funItems = [
    {
      id: 1,
      title: "What's a TV show you've enjoyed recently?",
      type: "chat",
      icon: Tv,
      bgColor: "bg-pink-50",
      iconColor: "text-pink-500",
      size: "small"
    },
    {
      id: 3,
      title: "What stood out about onboarding yesterday?",
      type: "chat",
      icon: MessageSquare,
      bgColor: "bg-teal-50",
      iconColor: "text-teal-500",
      size: "small"
    },
    {
      id: 4,
      title: "Which of your teammates is an Eagle Scout?",
      type: "multiple-choice",
      icon: Award,
      bgColor: "bg-indigo-50",
      iconColor: "text-indigo-500",
      size: "small",
      choices: ["John Smith", "Maria Garcia", "Alex Johnson", "Taylor Wu"]
    }
  ];

  const handleCardClick = (id: number) => {
    setActiveCardId(activeCardId === id ? null : id);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-800">Just for Fun</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        {funItems.map((item) => (
          <Card 
            key={item.id} 
            className={cn(
              "bg-white hover:shadow-md transition-shadow flex flex-col justify-between", 
              "md:col-span-2"
            )}
          >
            <CardContent className="p-6">
              <div className={`${item.bgColor} p-3 rounded-full w-fit mb-4`}>
                <item.icon className={`h-5 w-5 ${item.iconColor}`} />
              </div>
              <h3 className="font-medium text-lg">{item.title}</h3>
            </CardContent>
            
            <CardFooter className="px-6 pb-6 pt-0">
              {activeCardId === item.id ? (
                <div className="w-full">
                  {item.type === "chat" ? (
                    <div className="space-y-3">
                      <textarea 
                        className="w-full p-3 border rounded-md h-24 text-sm" 
                        placeholder="Type your response here..."
                      />
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setActiveCardId(null)}
                        >
                          Cancel
                        </Button>
                        <Button 
                          size="sm"
                          className="bg-sagebright-green hover:bg-sagebright-green/90"
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
                          className="w-full text-left p-3 border rounded-md hover:bg-gray-50 text-sm"
                        >
                          {String.fromCharCode(65 + index)}. {choice}
                        </button>
                      ))}
                      <div className="flex justify-end">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setActiveCardId(null)}
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
                  className="w-full"
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
