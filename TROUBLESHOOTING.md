# Troubleshooting Guide

## TypeScript Error: "Cannot find module 'react'"

This error appears in your IDE but the code actually compiles fine. Here's how to fix it:

### Solution 1: Restart TypeScript Server (VS Code)

1. Press `Ctrl+Shift+P` (Windows/Linux) or `Cmd+Shift+P` (Mac)
2. Type: `TypeScript: Restart TS Server`
3. Press Enter
4. Wait a few seconds for the server to restart

### Solution 2: Reload Editor Window

1. Press `Ctrl+Shift+P` (Windows/Linux) or `Cmd+Shift+P` (Mac)
2. Type: `Developer: Reload Window`
3. Press Enter

### Solution 3: Verify Installation

Run the fix script:
```bash
./fix-typescript.sh
```

Or manually verify:
```bash
# Check if React is installed
ls node_modules/react

# Check if React types are installed
ls node_modules/@types/react

# Verify TypeScript compilation works
npx tsc --noEmit
```

### Solution 4: Reinstall Dependencies

If the above doesn't work:
```bash
rm -rf node_modules package-lock.json
npm install
```

Then restart your editor.

### Solution 5: Check Your Editor Settings

**VS Code**: Make sure you're using the workspace TypeScript version:
1. Open any `.tsx` file
2. Click on the TypeScript version in the bottom-right status bar
3. Select "Use Workspace Version"

**Other IDEs**: Ensure they're configured to use the project's `tsconfig.json`

## Other Common Issues

### Port Already in Use

**Backend (8000)**:
```bash
# Find process using port 8000
lsof -i :8000

# Kill it
kill -9 <PID>
```

**Frontend (3000 or 5173)**:
```bash
# Find process
lsof -i :3000

# Kill it
kill -9 <PID>
```

### Backend Won't Start

```bash
# Check Python version (need 3.9+)
python3 --version

# Recreate virtual environment
rm -rf backend/venv
python3 -m venv backend/venv
source backend/venv/bin/activate
pip install -r backend/requirements.txt

# Start backend
python backend/main.py
```

### Frontend Won't Start

```bash
# Check Node version (need 18+)
node --version

# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm cache clean --force
npm install

# Start frontend
npm run dev
```

### Extension Not Working

1. Go to `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Reload" on the Masumi extension
4. Check browser console for errors (F12)
5. Verify backend is running: `curl http://localhost:8000/`

### Database Issues

```bash
# Reset database
rm -rf backend/data/*.json

# Restart backend
pkill -f "python backend/main.py"
python backend/main.py
```

### Network Timeout During npm install

```bash
# Use longer timeout
npm install --fetch-timeout=60000

# Or use yarn instead
yarn install
```

## Verification Commands

Check if everything is working:

```bash
# Check status
./check-status.sh

# Test backend API
curl http://localhost:8000/
curl http://localhost:8000/api/patterns?user_id=demo_user

# Test frontend
curl -I http://localhost:3000/

# View logs
tail -f backend.log
tail -f frontend.log
```

## Still Having Issues?

1. Check the logs:
   - `backend.log` - Backend errors
   - `frontend.log` - Frontend errors
   
2. Verify all prerequisites:
   - Python 3.9+
   - Node.js 18+
   - npm or yarn
   
3. Try the nuclear option:
   ```bash
   # Stop everything
   pkill -f uvicorn
   pkill -f vite
   
   # Clean everything
   rm -rf backend/venv backend/data node_modules package-lock.json
   
   # Reinstall
   npm install
   python3 -m venv backend/venv
   source backend/venv/bin/activate
   pip install -r backend/requirements.txt
   
   # Restart
   ./start-all.sh
   ```

## Getting Help

If none of these solutions work:
1. Check the GitHub issues
2. Review the SETUP.md guide
3. Ensure you're on a supported OS (Linux, macOS, WSL2)
