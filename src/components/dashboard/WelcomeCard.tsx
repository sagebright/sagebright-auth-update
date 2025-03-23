
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, HelpCircle } from "lucide-react";

export default function WelcomeCard() {
  const [userInput, setUserInput] = useState("");
  const [displayedText, setDisplayedText] = useState("");
  const fullText = "Want help figuring out what's most important today?";
  
  useEffect(() => {
    let index = 0;
    // Reset the displayed text when component mounts
    setDisplayedText("");
    
    // Create a typing effect interval
    const typingInterval = setInterval(() => {
      if (index < fullText.length) {
        setDisplayedText(fullText.substring(0, index + 1));
        index++;
      } else {
        clearInterval(typingInterval);
      }
    }, 50); // Adjust typing speed here
    
    return () => clearInterval(typingInterval);
  }, []);
  
  return (
    <Card className="w-full bg-gradient-to-r from-sagebright-accent/20 to-sagebright-green/5 border border-sagebright-accent/20 rounded-2xl shadow-card hover:shadow-card-hover transition-shadow">
      <CardContent className="p-6 md:p-8">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <Avatar className="h-24 w-24 md:h-32 md:w-32 border-2 border-white shadow-md">
            <AvatarImage src="/lovable-uploads/c3955ded-e6fc-4975-936a-d6fa82f47f72.png" alt="Sage AI Assistant" />
            <AvatarFallback className="bg-sagebright-accent text-sagebright-green">SG</AvatarFallback>
          </Avatar>
          
          <div className="w-full max-w-2xl space-y-5">
            <div className="bg-white/80 backdrop-blur-sm p-5 rounded-xl border border-sagebright-accent/20 shadow-sm">
              <h2 className="text-2xl md:text-3xl font-helvetica font-bold text-charcoal">
                {displayedText}
                <span className="animate-pulse">|</span>
              </h2>
              <p className="text-charcoal/80 mt-2 font-roboto">
                I can guide you through your priorities or help you discover resources you might need.
              </p>
            </div>
            
            <div className="space-y-4">
              <Input
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Type your response or question"
                className="bg-white border-sagebright-green/30 focus:border-sagebright-green"
              />
              
              <div className="flex flex-wrap justify-center gap-3">
                <Button className="bg-sagebright-green hover:bg-sagebright-green/90 text-white shadow-sm">
                  Show me <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button variant="outline" className="border-sagebright-green/30 text-charcoal hover:bg-sagebright-green/10">
                  Maybe later
                </Button>
                <Button variant="ghost" className="flex items-center gap-1 text-sagebright-coral hover:bg-sagebright-coral/10">
                  <HelpCircle className="h-4 w-4" /> 
                  Why this matters
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
