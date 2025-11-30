#!/bin/bash

echo "🚀 Masumi - GitHub Deployment Script"
echo "===================================="
echo ""

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "📦 Initializing git repository..."
    git init
fi

# Check for uncommitted changes
if [ -n "$(git status --porcelain)" ]; then
    echo "📝 Adding all files..."
    git add .
    
    echo "💾 Creating commit..."
    git commit -m "Initial commit: Masumi Workflow Intelligence Platform

- AI-powered workflow automation
- Browser extension for action capture  
- Pattern detection and code generation
- Cardano NFT minting integration
- React + Three.js frontend
- FastAPI backend
- Complete documentation"
else
    echo "✅ No changes to commit"
fi

# Check if remote exists
if git remote | grep -q "origin"; then
    echo "✅ Remote 'origin' already configured"
else
    echo ""
    echo "🔗 Configure GitHub remote:"
    echo "Please enter your GitHub repository URL"
    echo "Example: https://github.com/yourusername/masumi-workflow-intelligence.git"
    read -p "Repository URL: " repo_url
    
    if [ -n "$repo_url" ]; then
        git remote add origin "$repo_url"
        echo "✅ Remote added successfully"
    else
        echo "❌ No URL provided. Please run:"
        echo "   git remote add origin <your-repo-url>"
        exit 1
    fi
fi

# Push to GitHub
echo ""
echo "📤 Pushing to GitHub..."
git branch -M main

if git push -u origin main; then
    echo ""
    echo "🎉 Successfully deployed to GitHub!"
    echo ""
    echo "Next steps:"
    echo "1. Go to your GitHub repository"
    echo "2. Add topics/tags: cardano, blockchain, ai, automation, nft"
    echo "3. Add description and website URL"
    echo "4. Create a release (v1.0.0)"
    echo "5. Record and upload demo video"
    echo ""
    echo "📚 See DEPLOYMENT.md for detailed instructions"
else
    echo ""
    echo "❌ Push failed. This might be because:"
    echo "1. Repository doesn't exist on GitHub yet"
    echo "2. You don't have push permissions"
    echo "3. Remote URL is incorrect"
    echo ""
    echo "Please:"
    echo "1. Create repository on GitHub: https://github.com/new"
    echo "2. Run: git remote set-url origin <correct-url>"
    echo "3. Run this script again"
fi
