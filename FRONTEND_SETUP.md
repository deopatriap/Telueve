# Frontend Setup & Development Guide

## 📋 Requirements

- Node.js v18+ atau v20+
- npm atau yarn
- VS Code (recommended)
- Modern browser (Chrome, Firefox, Safari, Edge)

---

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Setup Environment Variables

Create `.env.local`:

```bash
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### 3. Run Development Server

```bash
npm run dev
```

Frontend akan berjalan di `http://localhost:3000`

---

## 📁 Project Structure

```
frontend/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx         # Login page
│   │   └── register/
│   │       └── page.tsx         # Register page
│   ├── (app)/
│   │   └── events/
│   │       └── page.tsx         # Events homepage
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Redirect page
│   └── globals.css              # Global styles
├── components/
│   ├── Button.tsx               # Reusable button
│   ├── Input.tsx                # Reusable input
│   ├── Card.tsx                 # Reusable card
│   └── Loading.tsx              # Loading spinner
├── lib/
│   └── api.ts                   # Axios API client
├── public/                       # Static assets
├── .vscode/                      # VS Code settings
│   ├── settings.json            # Workspace settings
│   └── extensions.json          # Recommended extensions
├── .env.local                   # Environment variables
├── next.config.mjs              # Next.js config
├── tailwind.config.js           # Tailwind CSS config
├── postcss.config.js            # PostCSS config
├── tsconfig.json                # TypeScript config
├── package.json                 # Dependencies
└── README.md
```

---

## 🛠️ Development Workflow

### File Naming Conventions

- **Components**: PascalCase (`Button.tsx`, `EventCard.tsx`)
- **Utilities**: camelCase (`api.ts`, `formatDate.ts`)
- **Pages**: lowercase (`page.tsx`, `layout.tsx`)

### Component Structure

```typescript
// components/ExampleComponent.tsx
"use client"; // if using hooks/interactivity

import React from "react";

interface ExampleComponentProps {
  title: string;
  onClick?: () => void;
}

export default function ExampleComponent({
  title,
  onClick,
}: ExampleComponentProps) {
  return (
    <div onClick={onClick} className="...">
      {title}
    </div>
  );
}
```

### Using API Client

```typescript
// lib/api.ts already configured with:
// - Base URL from environment
// - Axios instance with interceptors
// - Token management in localStorage

import { authAPI, eventAPI } from "@/lib/api";

// In component:
const handleLogin = async (email: string, password: string) => {
  const response = await authAPI.login(email, password);
  localStorage.setItem("token", response.token);
};

const handleSearchEvents = async (query: string) => {
  const results = await eventAPI.searchEvents(query);
};
```

---

## 🎨 Styling Guide

### Tailwind CSS Classes

Gunakan Tailwind utility classes untuk styling:

```jsx
// Button styling
<button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
  Click me
</button>

// Responsive layout
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {/* Content */}
</div>

// Flexbox
<div className="flex items-center justify-between gap-4">
  {/* Content */}
</div>

// Dark mode
<div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
  {/* Content */}
</div>
```

### Common Tailwind Patterns

```jsx
// Card component
<div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
  {/* Content */}
</div>

// Form input
<input
  type="text"
  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
/>

// Button variants
<button className="bg-blue-600 hover:bg-blue-700">Primary</button>
<button className="bg-gray-200 hover:bg-gray-300">Secondary</button>
<button className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50">Outline</button>
```

### Global CSS (globals.css)

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Custom animations */
@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-slide-in-up {
  animation: slideInUp 0.3s ease-out;
}

/* Custom utilities */
.text-gradient {
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
```

---

## 🔐 Authentication Management

### How Authentication Works

1. User registers → Password hashed on backend (bcrypt)
2. User logins → Backend generates JWT token
3. Frontend stores token in localStorage
4. Axios interceptor adds token to every request header
5. Backend verifies token for protected routes

### Token Storage

```typescript
// Save token
localStorage.setItem("token", response.token);

// Get token
const token = localStorage.getItem("token");

// Clear token (logout)
localStorage.removeItem("token");

// Check if logged in
const isLoggedIn = !!localStorage.getItem("token");
```

### Protected Routes

```typescript
// app/page.tsx - Redirect based on auth
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      router.push("/events");
    } else {
      router.push("/login");
    }
  }, [router]);
}
```

---

## 🧪 Testing Checklist

### Before Submitting

- [ ] No console errors
- [ ] All pages responsive (mobile, tablet, desktop)
- [ ] Dark mode works on all pages
- [ ] Login flow works (valid email & password)
- [ ] Register works (new user)
- [ ] Search events works
- [ ] Pagination navigates correctly
- [ ] Logout clears token and redirects
- [ ] Token persists after page refresh
- [ ] Error messages display properly

### Manual Testing Commands

```bash
# Check for TypeScript errors
npx tsc --noEmit

# Run ESLint
npx eslint . --ext .ts,.tsx

# Check for unused dependencies
npm audit

# Check bundle size
npm run build
```

---

## 🚀 Build for Production

### Build Static Export

```bash
npm run build
```

This creates an `.next` folder with optimized code.

### Environment Variables for Production

Create `.env.production.local`:

```bash
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
```

### Docker Deployment

```bash
# Build Docker image
docker build -t event-campus-frontend:latest .

# Run container
docker run -p 3000:3000 event-campus-frontend:latest
```

---

## 🐛 Troubleshooting

### Issue: "Cannot find module" errors

**Solution:**
```bash
rm -rf node_modules package-lock.json
npm install
```

### Issue: Port 3000 already in use

**Solution:**
```bash
npm run dev -- -p 3001
```

Or kill the process using port 3000:
```bash
# On Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# On Mac/Linux
lsof -i :3000
kill -9 <PID>
```

### Issue: API calls failing with CORS error

**Solution:**
- Check backend `.env` has `NEXT_PUBLIC_API_URL` correct
- Ensure backend is running
- Check backend has `cors()` middleware enabled
- Check token is being sent in Authorization header

### Issue: Dark mode not working

**Solution:**
- Make sure Tailwind dark mode is enabled in `tailwind.config.js`
- Add `dark:` prefix to classes
- Check system dark mode preference

### Issue: Tailwind classes not applying

**Solution:**
```bash
# Clear .next cache
rm -rf .next

# Restart dev server
npm run dev
```

---

## 📚 Useful Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Axios Documentation](https://axios-http.com/)

---

## 🎯 Performance Tips

1. **Code Splitting**: Next.js handles this automatically
2. **Image Optimization**: Use Next.js `Image` component
3. **Lazy Loading**: Use `dynamic()` for large components
4. **CSS**: Tailwind CSS production-optimized
5. **Caching**: Leverage browser caching with API tokens

---

## 📋 Pre-Deployment Checklist

- [ ] All environment variables set correctly
- [ ] No console errors in production build
- [ ] API endpoints tested and working
- [ ] Error handling implemented
- [ ] Loading states added
- [ ] Mobile responsive tested
- [ ] Dark mode tested
- [ ] Performance optimized (Lighthouse score > 80)
- [ ] SEO optimized (meta tags, etc.)
- [ ] Security headers configured (Docker/nginx)

---

## 🤝 Contributing

1. Create a new branch for feature: `git checkout -b feature/feature-name`
2. Make your changes
3. Test thoroughly
4. Commit: `git commit -m "feat: add feature description"`
5. Push: `git push origin feature/feature-name`
6. Create Pull Request

---

## 📞 Support

Jika ada masalah atau pertanyaan, hubungi tim development atau buat issue di repository.

Happy coding! 🎉
