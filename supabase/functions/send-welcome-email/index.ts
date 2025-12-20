import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface WelcomeEmailRequest {
  email: string;
  name: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, name }: WelcomeEmailRequest = await req.json();

    console.log(`Sending welcome email to ${email}`);

    const emailResponse = await resend.emails.send({
      from: "ApniSec <onboarding@resend.dev>",
      to: [email],
      subject: "Welcome to ApniSec - Your Security Journey Begins!",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; background-color: #0a0f1c; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
          <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
            <!-- Header -->
            <div style="text-align: center; margin-bottom: 40px;">
              <h1 style="color: #00f5ff; margin: 0; font-size: 32px;">
                🛡️ ApniSec
              </h1>
            </div>
            
            <!-- Main Content -->
            <div style="background-color: #111827; border-radius: 12px; padding: 40px; border: 1px solid #1f2937;">
              <h2 style="color: #ffffff; margin: 0 0 20px 0; font-size: 24px;">
                Welcome aboard, ${name || 'Security Champion'}!
              </h2>
              
              <p style="color: #9ca3af; line-height: 1.6; margin: 0 0 20px 0;">
                Thank you for joining ApniSec. You've taken the first step towards securing your digital assets with enterprise-grade cybersecurity solutions.
              </p>
              
              <p style="color: #9ca3af; line-height: 1.6; margin: 0 0 30px 0;">
                With your new account, you can:
              </p>
              
              <ul style="color: #9ca3af; line-height: 2; margin: 0 0 30px 0; padding-left: 20px;">
                <li>🔒 Track and manage security issues</li>
                <li>☁️ Request Cloud Security assessments</li>
                <li>🎯 Schedule Red Team engagements</li>
                <li>🛡️ Order VAPT services</li>
              </ul>
              
              <div style="text-align: center;">
                <a href="https://apnisec.com/dashboard" 
                   style="display: inline-block; background-color: #00f5ff; color: #0a0f1c; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">
                  Go to Dashboard
                </a>
              </div>
            </div>
            
            <!-- Footer -->
            <div style="text-align: center; margin-top: 40px;">
              <p style="color: #6b7280; font-size: 14px; margin: 0;">
                © 2024 ApniSec. Securing Your Digital Future.
              </p>
              <p style="color: #4b5563; font-size: 12px; margin: 10px 0 0 0;">
                Cyber Tower, Tech Park, Bangalore, India
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    console.log("Welcome email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, data: emailResponse }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error sending welcome email:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
