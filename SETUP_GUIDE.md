# 🔐 Contact Form Setup Guide

This guide will help you set up Cloudflare Turnstile protection and email delivery for the contact form.

## Step 1: Get Cloudflare Turnstile Keys

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Navigate to **Turnstile** in the left sidebar
3. Click **Add Site**
4. Configure:
   - **Site name**: EMMA Consulting Contact Form
   - **Domain**: `emmaconsulting.space` (or `*.pages.dev` for testing)
   - **Widget Mode**: Managed
5. Click **Create**
6. Copy both keys:
   - **Site Key** (public)
   - **Secret Key** (private)

## Step 2: Update HTML with Your Site Key

1. Open `index.html`
2. Find this line (around line 274):
   ```html
   <div class="cf-turnstile" data-sitekey="1x00000000000000000000AA" data-theme="dark"></div>
   ```
3. Replace `1x00000000000000000000AA` with your **Site Key**

## Step 3: Add Secret Key to Cloudflare Pages

### Via Dashboard:

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Navigate to **Workers & Pages**
3. Click on **emmaconsulting**
4. Go to **Settings** tab
5. Click **Environment variables**
6. Click **Add variable**
7. Add:
   - **Variable name**: `TURNSTILE_SECRET_KEY`
   - **Value**: Your Turnstile Secret Key
   - **Environment**: Production
8. Click **Save**

### Via Wrangler CLI:

```bash
wrangler pages secret put TURNSTILE_SECRET_KEY --project-name=emmaconsulting
# When prompted, paste your secret key
```

## Step 4: Configure Email Delivery

The contact form uses **MailChannels** (free for Cloudflare Workers/Pages).

### Enable MailChannels:

MailChannels is automatically available for Cloudflare Pages. No additional setup required!

### Configure SPF Record (Recommended):

Add this to your DNS records for `emmaconsulting.space`:

```
Type: TXT
Name: @
Value: v=spf1 include:_spf.mx.cloudflare.net ~all
```

### Configure DKIM (Optional but Recommended):

1. Add DNS records for DKIM:

```
Type: TXT
Name: mailchannels._domainkey
Value: v=DKIM1; p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDPtW5iwpXVPiH5FzJ7Nrl8USzuY9zqqzjE0D1r04xDN6qwziDnmgcFNNfMewVKN2D1O+2J9N73yr6SqCSaOmtP8iLGqm/U9JYH2iPMpZmb6PfrDKNyUxnLF3M7CxJ9jzf8J5/CKc9yJQrLQI6Pp2WBxl8HXA9Z0w+0nLFMjk0vJQIDAQAB
```

## Step 5: Test the Form

### Local Testing:

For local testing, Turnstile has test keys:

**Test Site Key (always passes)**:
```
1x00000000000000000000AA
```

**Test Secret Key**:
```
1x0000000000000000000000000000000AA
```

### Production Testing:

1. Deploy your changes:
   ```bash
   git add .
   git commit -m "Add contact form with Turnstile protection"
   git push
   wrangler pages deploy . --project-name=emmaconsulting
   ```

2. Visit your site
3. Fill out the contact form
4. Complete the Turnstile verification
5. Submit the form
6. Check `office@emmaconsulting.space` for the email

## Step 6: Monitor Form Submissions

### View Logs:

```bash
wrangler pages deployment tail --project-name=emmaconsulting
```

### Check for Errors:

1. Go to Cloudflare Dashboard
2. Navigate to **Workers & Pages** → **emmaconsulting**
3. Click **Logs** tab
4. View real-time function execution logs

## 🔒 Security Features

- ✅ **Turnstile Protection**: Prevents bot spam and automated submissions
- ✅ **Server-side Verification**: Token verified on the server, not just client
- ✅ **Rate Limiting**: Cloudflare automatically rate limits suspicious activity
- ✅ **DDoS Protection**: Built-in Cloudflare protection
- ✅ **Input Validation**: Both client and server-side validation
- ✅ **CORS Protection**: API only accepts requests from your domain

## 📧 Email Configuration

The form sends emails to: **office@emmaconsulting.space**

Email includes:
- Sender's name
- Sender's email (set as Reply-To)
- Organization (if provided)
- Message content
- Timestamp
- Professional HTML formatting

## 🛠️ Troubleshooting

### Form not submitting:

1. Check browser console for errors
2. Verify Turnstile site key is correct
3. Check that JavaScript is enabled
4. View function logs in Cloudflare dashboard

### Emails not received:

1. Check spam folder
2. Verify `office@emmaconsulting.space` exists
3. Check function logs for email sending errors
4. Verify DNS records are configured
5. Try sending a test email

### Turnstile not loading:

1. Check that the widget script is loading
2. Verify site key is correct
3. Check that domain is whitelisted in Turnstile settings
4. Try clearing browser cache

## 📊 Quick Commands

```bash
# Deploy changes
wrangler pages deploy . --project-name=emmaconsulting

# View logs
wrangler pages deployment tail --project-name=emmaconsulting

# Add secret
wrangler pages secret put TURNSTILE_SECRET_KEY --project-name=emmaconsulting

# List deployments
wrangler pages deployment list --project-name=emmaconsulting
```

## 🌐 Resources

- [Cloudflare Turnstile Docs](https://developers.cloudflare.com/turnstile/)
- [Pages Functions Docs](https://developers.cloudflare.com/pages/functions/)
- [MailChannels Docs](https://mailchannels.zendesk.com/hc/en-us)

---

**Need Help?**

If you encounter any issues, check the Cloudflare dashboard logs or contact support.

