# Vercel Deployment Guide for Jamgram Ghoshbari

Follow these steps to get your "clean" Vercel link working perfectly.

## 1. Export the Code
- Click the **Settings (gear icon)** at the top left of AI Studio.
- Choose **Export to GitHub** (recommended) or **Download as ZIP**.

## 2. Create Vercel Project
- Go to [Vercel](https://vercel.com) and click **Add New > Project**.
- Select the GitHub repository you just exported.

## 3. Important: Environment Variables (Secrets)
During the Vercel setup (under the "Environment Variables" section), you **MUST** add these keys so your image uploads work:

1. **VITE_IMGBB_API_KEY**: 
   - Value: `[Your ImgBB Key here]` 
   - (Get it from https://api.imgbb.com/)

2. **GEMINI_API_KEY**:
   - Value: `[Your Gemini API Key]`
   - (This allows any AI features to work in production)

## 4. Why this works?
- I have already added a `vercel.json` file to your proejct.
- This file tells Vercel: "Everything should point to index.html".
- This is what makes your links like `/admin` or `/post/123` work perfectly without showing a "404 Not Found" error.

## 5. Custom Domain (The "Clean" Link)
Once the app is deployed on Vercel:
- Go to **Project Settings > Domains**.
- Type in `jamgramghoshbari.com` (if you have bought it).
- Follow the instructions to change your DNS records.

**Need help with specific Vercel errors? Let me know!**
