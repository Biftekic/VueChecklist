#!/bin/bash

echo "GitHub Repository Push Helper"
echo "=============================="
echo ""

# Get GitHub username
read -p "Enter your GitHub username: " GITHUB_USER

# Check if user wants to use HTTPS or SSH
echo ""
echo "Choose authentication method:"
echo "1) HTTPS (username/password or token)"
echo "2) SSH (requires SSH key setup)"
read -p "Enter choice (1 or 2): " AUTH_METHOD

# Remove existing remote if present
git remote remove origin 2>/dev/null

# Add remote based on choice
if [ "$AUTH_METHOD" == "2" ]; then
    echo "Adding SSH remote..."
    git remote add origin git@github.com:${GITHUB_USER}/VueChecklist.git
else
    echo "Adding HTTPS remote..."
    git remote add origin https://github.com/${GITHUB_USER}/VueChecklist.git
fi

echo ""
echo "Remote added. Repository URL:"
git remote -v
echo ""

echo "Attempting to push..."
echo "If this is a new repository, make sure you've created it on GitHub first!"
echo ""

# Try to push
git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Successfully pushed to GitHub!"
    echo "🔗 Your repository: https://github.com/${GITHUB_USER}/VueChecklist"
else
    echo ""
    echo "❌ Push failed. Please ensure:"
    echo "1. You've created the repository on GitHub"
    echo "2. The repository name is exactly: VueChecklist"
    echo "3. You have the correct permissions"
    echo ""
    echo "To create repository via GitHub CLI:"
    echo "gh auth login"
    echo "gh repo create VueChecklist --public --source=. --push"
fi