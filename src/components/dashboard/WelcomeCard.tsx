
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, HelpCircle } from "lucide-react";

export default function WelcomeCard() {
  const [userInput, setUserInput] = useState("");
  
  return (
    <Card className="w-full bg-gradient-to-r from-sagebright-accent/30 to-sagebright-green/10 border-none">
      <CardContent className="p-6 md:p-8">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          <Avatar className="h-16 w-16 border-2 border-white">
            <AvatarImage src="/lovable-uploads/c3955ded-e6fc-4975-936a-d6fa82f47f72.png" alt="Sage AI Assistant" />
            <AvatarFallback className="bg-sagebright-accent text-sagebright-green">SG</AvatarFallback>
          </Avatar>
          
          <div className="flex-1 space-y-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
                Good morning, Adam!
              </h2>
              <p className="text-gray-600 mt-1">
                Want help figuring out what's most important today?
              </p>
            </div>
            
            <div className="space-y-4">
              <Input
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Type your response or question"
                className="bg-white"
              />
              
              <div className="flex flex-wrap gap-3">
                <Button className="bg-sagebright-green hover:bg-sagebright-green/90">
                  Show me <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button variant="outline">
                  Maybe later
                </Button>
                <Button variant="ghost" className="flex items-center gap-1">
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
