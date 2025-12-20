import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface IssueNotificationRequest {
  email: string;
  userName: string;
  issueTitle: string;
  issueType: string;
  issuePriority: string;
  issueDescription: string;
}

const issueTypeLabels: Record<string, string> = {
  'cloud-security': 'Cloud Security',
  'redteam-assessment': 'Red Team Assessment',
  'vapt': 'VAPT',
};

const priorityColors: Record<string, string> = {
  'low': '#6b7280',
  'medium': '#eab308',
  'high': '#f97316',
  'critical': '#ef4444',
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, userName, issueTitle, issueType, issuePriority, issueDescription }: IssueNotificationRequest = await req.json();

    console.log(`Sending issue notification to ${email} for issue: ${issueTitle}`);

    const typeLabel = issueTypeLabels[issueType] || issueType;
    const priorityColor = priorityColors[issuePriority] || '#6b7280';

    const emailResponse = await resend.emails.send({
      from: "ApniSec <onboarding@resend.dev>",
      to: [email],
      subject: `[ApniSec] New Issue Created: ${issueTitle}`,
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
              <h2 style="color: #ffffff; margin: 0 0 10px 0; font-size: 24px;">
                New Issue Created
              </h2>
              
              <p style="color: #9ca3af; margin: 0 0 30px 0;">
                Hi ${userName || 'there'}, your security issue has been logged successfully.
              </p>
              
              <!-- Issue Card -->
              <div style="background-color: #1f2937; border-radius: 8px; padding: 24px; margin-bottom: 30px;">
                <h3 style="color: #ffffff; margin: 0 0 16px 0; font-size: 18px;">
                  ${issueTitle}
                </h3>
                
                <div style="display: flex; gap: 12px; margin-bottom: 16px;">
                  <span style="background-color: rgba(0, 245, 255, 0.2); color: #00f5ff; padding: 4px 12px; border-radius: 4px; font-size: 12px; font-weight: 500;">
                    ${typeLabel}
                  </span>
                  <span style="background-color: ${priorityColor}33; color: ${priorityColor}; padding: 4px 12px; border-radius: 4px; font-size: 12px; font-weight: 500; text-transform: uppercase;">
                    ${issuePriority}
                  </span>
                </div>
                
                <p style="color: #9ca3af; margin: 0; line-height: 1.6; font-size: 14px;">
                  ${issueDescription.substring(0, 200)}${issueDescription.length > 200 ? '...' : ''}
                </p>
              </div>
              
              <p style="color: #9ca3af; line-height: 1.6; margin: 0 0 30px 0;">
                Our security team will review your issue and take appropriate action. You can track the status of this issue in your dashboard.
              </p>
              
              <div style="text-align: center;">
                <a href="https://apnisec.com/dashboard" 
                   style="display: inline-block; background-color: #00f5ff; color: #0a0f1c; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">
                  View in Dashboard
                </a>
              </div>
            </div>
            
            <!-- Footer -->
            <div style="text-align: center; margin-top: 40px;">
              <p style="color: #6b7280; font-size: 14px; margin: 0;">
                © 2024 ApniSec. Securing Your Digital Future.
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    console.log("Issue notification email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, data: emailResponse }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error sending issue notification:", error);
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
