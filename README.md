# Tri-county Membership Manager

A comprehensive membership management system built with Next.js 14, TypeScript, and Tailwind CSS. This application provides full-featured member and waitlist management capabilities with a REST API architecture.

🚀 **[Live Demo](https://tri-county-membership-manager.onrender.com)** (Deploy to see it in action!)

## ✨ Features

- **Member Management**: Complete CRUD operations for member profiles
- **Waitlist System**: Automated waitlist with position tracking and approval workflow
- **Authentication & Authorization**: Role-based access control (Admin, Member, Waitlist)
- **REST API**: Well-documented API endpoints for all operations
- **Modern UI**: Responsive design with Tailwind CSS and Next.js 14
- **TypeScript**: Full type safety throughout the application
- **Health Monitoring**: Built-in health check endpoints

## 🛠️ Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **API**: REST endpoints with Next.js API routes
- **Authentication**: Custom JWT-like token system
- **Deployment**: Render (configuration included)

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm package manager

### Installation

```bash
# Clone the repository
git clone https://github.com/hawkpdx/tri-county-membership-manager.git
cd tri-county-membership-manager

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

### Build and Deploy

```bash
# Build for production
npm run build

# Start production server
npm start

# Run type checking and linting
npm run lint
```

## 📚 API Documentation

### Base URL
`/api/v1`

### Endpoints

#### Authentication
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/logout` - User logout
- `POST /api/v1/auth/register-admin` - Admin registration
- `POST /api/v1/auth/refresh` - Token refresh

#### Members
- `GET /api/v1/members` - List all members (paginated)
- `POST /api/v1/members` - Create new member
- `PATCH /api/v1/members/:id` - Update member

#### Waitlist
- `GET /api/v1/waitlist` - List waitlist members
- `POST /api/v1/waitlist` - Add to waitlist
- `PATCH /api/v1/waitlist/:id` - Update waitlist member or approve
- `DELETE /api/v1/waitlist/:id` - Remove from waitlist

#### System
- `GET /api/v1/health` - Health check endpoint

## 🔧 Configuration

### Environment Variables

For development, create a `.env.local` file:

```env
NODE_ENV=development
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000
```

For production deployment, set:
- `NODE_ENV=production`
- `PORT=10000` (or your preferred port)

## 🚀 Deployment

This project is configured for easy deployment on Render.

### Deploy to Render

1. Fork this repository to your GitHub account
2. Go to [Render Dashboard](https://dashboard.render.com/)
3. Click "New" > "Blueprint"
4. Connect your GitHub repository
5. Select this repository - Render will automatically use the `render.yaml` configuration
6. Your app will be deployed automatically!

For detailed deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md).

### Alternative Deployment Options

This Next.js application can also be deployed to:
- Vercel
- Netlify
- Railway
- Any Node.js hosting platform

## 🏗️ Project Structure

```
tri-county-membership-manager/
├── src/
│   ├── app/                 # Next.js 14 App Router
│   │   ├── api/v1/         # API routes
│   │   │   ├── auth/       # Authentication endpoints
│   │   │   ├── members/    # Member management
│   │   │   ├── waitlist/   # Waitlist management
│   │   │   └── health/     # Health check
│   │   ├── globals.css     # Global styles
│   │   ├── layout.tsx      # Root layout
│   │   └── page.tsx        # Home page
│   ├── types/              # TypeScript definitions
│   └── utils/              # Utility functions
├── public/                 # Static assets
├── render.yaml             # Render deployment config
├── DEPLOYMENT.md           # Deployment guide
└── README.md              # This file
```

## 🔒 Security Features

- Role-based access control
- Password validation with requirements
- Token-based authentication
- Input validation and sanitization
- CORS configuration

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 👤 Author

**Garrett Hawkins**
- GitHub: [@hawkpdx](https://github.com/hawkpdx)

---

*Built with Next.js, TypeScript, and modern web development practices*
