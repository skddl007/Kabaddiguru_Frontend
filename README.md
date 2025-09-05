# KabaddiGuru Frontend

A modern, responsive Next.js frontend application for KabaddiGuru - an AI-powered sports analytics platform that provides intelligent insights for Kabaddi teams and analysts.

## 🚀 Features

- **Natural Language Chat Interface** - Ask questions about Kabaddi data in plain English
- **Interactive Analytics Dashboard** - Visualize player performance, match statistics, and team analytics
- **Real-time Data Visualization** - Charts and graphs powered by Recharts
- **Responsive Design** - Mobile-first approach with Tailwind CSS
- **Authentication System** - Secure user authentication and authorization
- **Modern UI Components** - Built with Radix UI and shadcn/ui
- **Video Streaming Integration** - Support for match video analysis
- **Subscription Management** - User subscription and limit management

## 🛠️ Tech Stack

- **Framework**: Next.js 15.0.0
- **Language**: JavaScript/TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI + shadcn/ui
- **Charts**: Recharts
- **Icons**: Lucide React
- **Forms**: React Hook Form + Zod validation
- **State Management**: React Context API
- **Authentication**: Custom JWT-based auth
- **Deployment**: Google Cloud Run

## 📁 Project Structure

```
kabaddi_frontend/
├── app/                          # Next.js App Router
│   ├── api/                      # API routes
│   │   ├── analytics/            # Analytics endpoints
│   │   ├── auth/                 # Authentication endpoints
│   │   ├── contact/              # Contact form endpoint
│   │   ├── dashboard/            # Dashboard data endpoints
│   │   ├── suggestions/          # AI suggestions endpoint
│   │   └── video/                # Video streaming endpoints
│   ├── about/                    # About page
│   ├── analytics/                # Analytics tool page
│   ├── chat/                     # Chat interface page
│   ├── contact/                  # Contact page
│   ├── dashboard/                # Main dashboard page
│   ├── matches/                  # Matches page
│   ├── players/                  # Players page
│   ├── upload/                   # Data upload page
│   ├── globals.css               # Global styles
│   ├── layout.jsx                # Root layout
│   └── page.jsx                  # Home page
├── components/                   # Reusable components
│   ├── ui/                       # shadcn/ui components
│   ├── AuthModal.jsx             # Authentication modal
│   ├── DashboardFilters.jsx      # Dashboard filtering
│   ├── MatchDetails.jsx          # Match details component
│   ├── VideoPlayer.jsx           # Video player component
│   └── ...                       # Other components
├── contexts/                     # React contexts
│   └── UserContext.jsx           # User authentication context
├── hooks/                        # Custom React hooks
├── lib/                          # Utility libraries
│   ├── api-client.js             # API client configuration
│   ├── email-service.js          # Email service utilities
│   └── utils.ts                  # General utilities
├── public/                       # Static assets
│   ├── team-logos/               # Team logo images
│   └── ...                       # Other static files
└── styles/                       # Additional stylesheets
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Backend API running (see KabaddiGuru_Backend)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd kabaddi_frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   
   Create a `.env.local` file in the root directory:
   ```env
   # Backend API URL
   NEXT_PUBLIC_API_URL=http://localhost:8000
   
   # App Configuration
   NEXT_PUBLIC_APP_NAME=Kabaddi Guru Analytics
   NEXT_PUBLIC_APP_VERSION=1.0.0
   NEXT_PUBLIC_DEBUG_MODE=true
   ```

   Or use the existing `config.env` file and modify the API URL as needed.

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run setup:dev` - Setup development environment
- `npm run setup:prod` - Setup production environment
- `npm run deploy` - Build and deploy to production

## 🌐 Environment Configuration

The application supports multiple environment configurations:

### Development
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_DEBUG_MODE=true
```

### Production
```env
NEXT_PUBLIC_API_URL=https://api.thekabaddiguru.com
NEXT_PUBLIC_DEBUG_MODE=false
```

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_API_URL` | Backend API base URL | Yes |
| `NEXT_PUBLIC_API_URL_ALT` | Alternative API URL | No |
| `NEXT_PUBLIC_API_URL_ALT2` | Second alternative API URL | No |
| `NEXT_PUBLIC_APP_NAME` | Application name | No |
| `NEXT_PUBLIC_APP_VERSION` | Application version | No |
| `NEXT_PUBLIC_DEBUG_MODE` | Enable debug mode | No |

## 📱 Pages & Features

### Home Page (`/`)
- Landing page with feature overview
- Authentication options
- Navigation to main features

### Chat Interface (`/chat`)
- Natural language chat with Kabaddi data
- AI-powered insights and analysis
- Conversation history

### Analytics Tool (`/analytics`)
- Interactive analytics dashboard
- Player performance metrics
- Team statistics and comparisons

### Dashboard (`/dashboard`)
- Comprehensive data visualization
- Match and player analytics
- Filtering and search capabilities

### Matches (`/matches`)
- Match listings and details
- Match statistics and analysis
- Historical match data

### Players (`/players`)
- Player profiles and statistics
- Performance tracking
- Player comparisons

### Upload (`/upload`)
- Data upload interface
- File format support (CSV, Excel)
- Data validation and processing

## 🎨 UI Components

The application uses a comprehensive set of UI components built with Radix UI and styled with Tailwind CSS:

- **Layout Components**: Cards, Sheets, Dialogs, Modals
- **Form Components**: Inputs, Selects, Checkboxes, Radio Groups
- **Navigation**: Menus, Breadcrumbs, Pagination
- **Data Display**: Tables, Charts, Badges, Avatars
- **Feedback**: Toasts, Alerts, Progress indicators

## 🔐 Authentication

The application implements a custom JWT-based authentication system:

- **Sign Up/Sign In** - User registration and login
- **User Context** - Global user state management
- **Protected Routes** - Route-level authentication
- **Session Management** - Automatic token refresh
- **Subscription Limits** - Usage tracking and limits

## 📊 Data Visualization

Powered by Recharts library for interactive charts and graphs:

- Line charts for performance trends
- Bar charts for comparisons
- Pie charts for distribution data
- Area charts for cumulative metrics
- Responsive design for all screen sizes

## 🎥 Video Integration

- Video streaming support for match analysis
- Token-based video access
- URL-based video loading
- Responsive video player

## 🚀 Deployment

### Google Cloud Run

The application is configured for deployment on Google Cloud Run:

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Deploy using Cloud Build**
   ```bash
   gcloud builds submit --config cloudbuild.yaml
   ```

### Docker

A Dockerfile is included for containerized deployment:

```bash
docker build -t kabaddi-frontend .
docker run -p 3000:3000 kabaddi-frontend
```

## 🔧 Configuration Files

- `next.config.mjs` - Next.js configuration
- `tailwind.config.ts` - Tailwind CSS configuration
- `tsconfig.json` - TypeScript configuration
- `components.json` - shadcn/ui configuration
- `cloudbuild.yaml` - Google Cloud Build configuration

## 📝 API Integration

The frontend communicates with the backend through RESTful APIs:

- **Authentication APIs** - User management
- **Analytics APIs** - Data analysis and insights
- **Dashboard APIs** - Dashboard data and filters
- **Video APIs** - Video streaming and management
- **Contact APIs** - Contact form submissions

## 🐛 Troubleshooting

### Common Issues

1. **API Connection Issues**
   - Verify `NEXT_PUBLIC_API_URL` is correct
   - Check if backend server is running
   - Verify CORS settings on backend

2. **Build Errors**
   - Clear `.next` folder and rebuild
   - Check for TypeScript errors
   - Verify all dependencies are installed

3. **Authentication Issues**
   - Clear browser storage
   - Check JWT token validity
   - Verify backend authentication endpoints

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is part of the KabaddiGuru platform. All rights reserved.

## 🆘 Support

For support and questions:
- Check the documentation
- Contact the development team
- Submit issues on the repository

---

**KabaddiGuru Frontend** - Intelligent Sports Analytics Platform