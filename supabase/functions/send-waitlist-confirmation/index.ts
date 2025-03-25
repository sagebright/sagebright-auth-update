
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface WaitlistRequest {
  firstName: string;
  lastName: string;
  email: string;
  company?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { firstName, lastName, email, company }: WaitlistRequest = await req.json();

    if (!email || !firstName || !lastName) {
      return new Response(
        JSON.stringify({ 
          error: "Missing required fields: first name, last name, and email are required" 
        }), {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    const emailResponse = await resend.emails.send({
      from: "Sagebright <onboarding@resend.dev>",
      to: [email],
      subject: "Welcome to the Sagebright Beta Waitlist!",
      html: `
        <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #274754;">
          <img src="https://your-domain.com/lovable-uploads/sb_logo.png" alt="Sagebright Logo" style="width: 150px; margin-bottom: 20px;" />
          
          <h1 style="color: #2A9D90; font-size: 24px;">Thank you for joining our waitlist, ${firstName}!</h1>
          
          <p style="font-size: 16px; line-height: 1.5; margin-bottom: 20px;">
            We're excited that you're interested in Sagebright's AI-powered onboarding platform. We're currently in closed beta, and we're carefully selecting organizations to help shape what's next.
          </p>
          
          <p style="font-size: 16px; line-height: 1.5; margin-bottom: 20px;">
            Our team will review your request and be in touch soon with next steps. In the meantime, if you have any questions, feel free to reply to this email.
          </p>
          
          <div style="background-color: #F2F7F6; padding: 15px; border-radius: 6px; margin-bottom: 20px;">
            <p style="margin: 0; font-size: 14px; color: #274754;">
              <strong>Why Sagebright?</strong> We're transforming the onboarding experience by providing new hires with a personalized AI guide that helps them navigate their first weeks and months, while giving HR teams valuable insights without compromising privacy.
            </p>
          </div>
          
          <p style="font-size: 16px; line-height: 1.5;">
            Best regards,<br>
            The Sagebright Team
          </p>
        </div>
      `,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error in waitlist confirmation email:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
