/**
 * Cloudflare Pages Function - Contact Form Handler
 * Handles form submissions with Turnstile verification and email sending
 */

export async function onRequestPost(context) {
    try {
        // Parse the request body
        const formData = await context.request.json();
        const { name, email, organization, message, 'cf-turnstile-response': token } = formData;

        // Validate required fields
        if (!name || !email || !message || !token) {
            return new Response(JSON.stringify({ 
                success: false, 
                error: 'Missing required fields' 
            }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Verify Turnstile token
        const turnstileVerification = await verifyTurnstile(token, context.env.TURNSTILE_SECRET_KEY);
        
        if (!turnstileVerification.success) {
            return new Response(JSON.stringify({ 
                success: false, 
                error: 'Security verification failed' 
            }), {
                status: 403,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Send email using MailChannels (Cloudflare's built-in email service)
        const emailSent = await sendEmail({
            to: 'office@emmaconsulting.space',
            from: 'noreply@emmaconsulting.space',
            replyTo: email,
            subject: `New Contact Form Submission from ${name}`,
            html: generateEmailHTML(name, email, organization, message)
        });

        if (emailSent) {
            return new Response(JSON.stringify({ 
                success: true, 
                message: 'Email sent successfully' 
            }), {
                status: 200,
                headers: { 'Content-Type': 'application/json' }
            });
        } else {
            throw new Error('Failed to send email');
        }

    } catch (error) {
        console.error('Contact form error:', error);
        return new Response(JSON.stringify({ 
            success: false, 
            error: 'Internal server error' 
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}

/**
 * Verify Cloudflare Turnstile token
 */
async function verifyTurnstile(token, secretKey) {
    const formData = new FormData();
    formData.append('secret', secretKey);
    formData.append('response', token);

    const result = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
        method: 'POST',
        body: formData
    });

    return await result.json();
}

/**
 * Send email using MailChannels API (Cloudflare Workers compatible)
 */
async function sendEmail({ to, from, replyTo, subject, html }) {
    const send_request = new Request('https://api.mailchannels.net/tx/v1/send', {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
        },
        body: JSON.stringify({
            personalizations: [
                {
                    to: [{ email: to }],
                    dkim_domain: 'emmaconsulting.space',
                    dkim_selector: 'mailchannels',
                },
            ],
            from: {
                email: from,
                name: 'EMMA Aerospace Consulting',
            },
            reply_to: {
                email: replyTo,
            },
            subject: subject,
            content: [
                {
                    type: 'text/html',
                    value: html,
                },
            ],
        }),
    });

    try {
        const response = await fetch(send_request);
        return response.ok;
    } catch (error) {
        console.error('Email send error:', error);
        return false;
    }
}

/**
 * Generate HTML email template
 */
function generateEmailHTML(name, email, organization, message) {
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #0a4da3 0%, #1e88e5 100%); color: white; padding: 30px; text-align: center; }
        .content { background: #f8f9fa; padding: 30px; margin-top: 20px; border-radius: 8px; }
        .field { margin-bottom: 20px; }
        .field-label { font-weight: bold; color: #0a4da3; margin-bottom: 5px; }
        .field-value { background: white; padding: 15px; border-radius: 5px; border-left: 4px solid #00d4ff; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>EMMA Aerospace Consulting</h1>
            <p>New Contact Form Submission</p>
        </div>
        <div class="content">
            <div class="field">
                <div class="field-label">Name:</div>
                <div class="field-value">${name}</div>
            </div>
            <div class="field">
                <div class="field-label">Email:</div>
                <div class="field-value"><a href="mailto:${email}">${email}</a></div>
            </div>
            ${organization ? `
            <div class="field">
                <div class="field-label">Organization:</div>
                <div class="field-value">${organization}</div>
            </div>
            ` : ''}
            <div class="field">
                <div class="field-label">Message:</div>
                <div class="field-value">${message.replace(/\n/g, '<br>')}</div>
            </div>
            <div class="field">
                <div class="field-label">Timestamp:</div>
                <div class="field-value">${new Date().toUTCString()}</div>
            </div>
        </div>
        <div class="footer">
            <p>This email was sent from the EMMA Aerospace Consulting contact form</p>
            <p>© ${new Date().getFullYear()} EMMA Aerospace Consulting LLP</p>
        </div>
    </div>
</body>
</html>
    `.trim();
}

