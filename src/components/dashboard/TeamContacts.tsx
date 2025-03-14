
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Phone } from "lucide-react";
import { cn } from "@/lib/utils";

interface TeamContactsProps {
  className?: string;
}

export default function TeamContacts({ className }: TeamContactsProps) {
  const contacts = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "HR Manager",
      email: "sarah.johnson@company.com",
      phone: "(555) 123-4567",
      avatar: "SJ",
      bgColor: "bg-purple-100",
      textColor: "text-purple-600",
    },
    {
      id: 2,
      name: "Michael Chen",
      role: "Department Lead",
      email: "michael.chen@company.com",
      phone: "(555) 234-5678",
      avatar: "MC",
      bgColor: "bg-blue-100",
      textColor: "text-blue-600",
    },
    {
      id: 3,
      name: "Lisa Rodriguez",
      role: "Onboarding Buddy",
      email: "lisa.rodriguez@company.com",
      phone: "(555) 345-6789",
      avatar: "LR",
      bgColor: "bg-sagebright-accent",
      textColor: "text-sagebright-green",
    },
    {
      id: 4,
      name: "James Wilson",
      role: "IT Support",
      email: "james.wilson@company.com",
      phone: "(555) 456-7890",
      avatar: "JW",
      bgColor: "bg-red-100",
      textColor: "text-red-600",
    },
  ];

  return (
    <Card className={cn("bg-white", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle>Key Team Contacts</CardTitle>
          <Button variant="outline" size="sm" className="h-8 text-xs">
            View All Contacts
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {contacts.map((contact) => (
            <Card key={contact.id} className="border-none shadow-sm">
              <CardContent className="p-4 flex flex-col items-center text-center">
                <div className={cn("w-12 h-12 rounded-full flex items-center justify-center mb-3", 
                  contact.bgColor)}>
                  <span className={cn("text-lg font-bold", contact.textColor)}>
                    {contact.avatar}
                  </span>
                </div>
                <h3 className="font-medium">{contact.name}</h3>
                <p className="text-sm text-muted-foreground mb-2">{contact.role}</p>
                <div className="flex items-center text-xs text-muted-foreground">
                  <Mail className="h-3 w-3 mr-1" />
                  <span className="truncate">{contact.email}</span>
                </div>
                <div className="flex items-center text-xs text-muted-foreground mt-1">
                  <Phone className="h-3 w-3 mr-1" />
                  <span>{contact.phone}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// We need to add the Button component
const Button = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
    size?: "default" | "sm" | "lg";
  }
>(({ className, variant = "default", size = "default", ...props }, ref) => {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors",
        variant === "outline" && "border border-input bg-transparent hover:bg-accent",
        size === "sm" && "h-9 rounded-md px-3",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Button.displayName = "Button";
