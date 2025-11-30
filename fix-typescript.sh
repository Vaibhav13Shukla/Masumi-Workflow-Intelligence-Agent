#!/bin/bash

echo "🔧 Fixing TypeScript Configuration..."
echo ""

# Verify React is installed
if [ -d "node_modules/react" ]; then
    echo "✅ React installed"
else
    echo "❌ React not found - running npm install..."
    npm install
fi

# Verify @types/react is installed
if [ -d "node_modules/@types/react" ]; then
    echo "✅ @types/react installed"
else
    echo "❌ @types/react not found - installing..."
    npm install --save-dev @types/react @types/react-dom
fi

# Check TypeScript
if [ -f "node_modules/.bin/tsc" ]; then
    echo "✅ TypeScript installed"
    echo ""
    echo "Running TypeScript check..."
    npx tsc --noEmit 2>&1 | head -20
else
    echo "❌ TypeScript not found"
fi

echo ""
echo "================================"
echo "✨ TypeScript setup complete!"
echo ""
echo "If you're using VS Code, try:"
echo "  1. Press Ctrl+Shift+P (or Cmd+Shift+P on Mac)"
echo "  2. Type 'TypeScript: Restart TS Server'"
echo "  3. Press Enter"
echo ""
echo "Or simply reload your editor window."
