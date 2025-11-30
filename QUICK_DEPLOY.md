# ⚡ Quick Deploy to GitHub

## 🚀 3-Step Deployment

### Step 1: Create GitHub Repository (2 minutes)

1. Go to: **https://github.com/new**
2. Fill in:
   - **Repository name**: `masumi-workflow-intelligence`
   - **Description**: `AI-powered workflow automation platform on Cardano`
   - **Visibility**: ✅ Public
   - **Initialize**: ❌ DO NOT check any boxes
3. Click **"Create repository"**

### Step 2: Deploy (1 minute)

Run the deployment script:

```bash
./deploy-to-github.sh
```

When prompted, enter your repository URL:
```
https://github.com/YOUR_USERNAME/masumi-workflow-intelligence.git
```

**OR** Deploy manually:

```bash
git add .
git commit -m "Initial commit: Masumi Workflow Intelligence Platform"
git remote add origin https://github.com/YOUR_USERNAME/masumi-workflow-intelligence.git
git branch -M main
git push -u origin main
```

### Step 3: Configure (2 minutes)

On GitHub:

1. **Add Topics** (Settings → scroll down):
   ```
   cardano, blockchain, ai, automation, nft, workflow, python, react, typescript, fastapi
   ```

2. **Update About** (top right):
   - Description: `AI-powered workflow automation platform on Cardano`
   - Website: Your demo URL (if deployed)

3. **Create Release** (Releases → Create new release):
   - Tag: `v1.0.0`
   - Title: `Masumi v1.0.0 - Initial Release`
   - Description: See DEPLOYMENT.md for template

---

## ✅ Done!

Your repository is now live at:
```
https://github.com/YOUR_USERNAME/masumi-workflow-intelligence
```

---

## 📝 Optional: Add Demo Video

1. Record 3-5 minute demo
2. Upload to YouTube
3. Add link to README.md:
   ```markdown
   ## 🎥 Demo Video
   
   [![Masumi Demo](thumbnail.jpg)](https://youtube.com/watch?v=YOUR_VIDEO_ID)
   ```

---

## 🎯 Hackathon Submission

Submit these links:
- **Repository**: `https://github.com/YOUR_USERNAME/masumi-workflow-intelligence`
- **Demo**: `http://localhost:3000` (or deployed URL)
- **Video**: YouTube link (if created)
- **Docs**: Link to README.md

---

**That's it! You're ready to submit! 🎉**
