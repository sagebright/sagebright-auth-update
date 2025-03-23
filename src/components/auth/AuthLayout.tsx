
import React from "react";
import Logo from "@/components/Logo";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

interface AuthLayoutProps {
  title: string;
  heading: string;
  subheading: string;
  footer: React.ReactNode;
  children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ 
  title, 
  heading, 
  subheading, 
  footer, 
  children 
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Logo variant="full" className="mx-auto mb-6" />
          <h1 className="text-2xl font-bold text-gray-900 font-helvetica">{heading}</h1>
          <p className="text-gray-600 font-roboto">{subheading}</p>
        </div>
        
        <Card className="border-0 shadow-md rounded-xl">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-xl font-bold font-helvetica">{title}</CardTitle>
            <CardDescription className="font-roboto">
              {children[0]}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {children[1]}
          </CardContent>
          <CardFooter className="flex justify-center border-t pt-4">
            {footer}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default AuthLayout;
