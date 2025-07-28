# CrystalStock AI - Ethereal Market Intelligence

A sophisticated stock market prediction application with AI-powered analysis, featuring a beautiful dark-themed interface and advanced neural network capabilities.

## 🌟 Overview

CrystalStock AI is a full-stack web application that combines cutting-edge AI technology with elegant design to provide users with advanced stock market predictions and analysis. The application features a crystalline, ethereal aesthetic with seamless animations and a modern user experience.

## 🎯 The Idea Behind CrystalStock AI

The concept behind CrystalStock AI was to create a sophisticated yet accessible platform for stock market analysis that:

- **Democratizes AI**: Makes advanced neural network predictions accessible to everyday investors
- **Visual Excellence**: Combines functionality with stunning visual design using ethereal themes
- **Real-time Intelligence**: Provides live market data and AI-powered predictions
- **User Experience**: Offers an intuitive interface that makes complex financial analysis simple

### Key Features:
- **AI-Powered Predictions**: Neural network analysis of market patterns
- **Real-time Data**: Live stock data from global exchanges
- **Interactive Charts**: Beautiful visualizations of stock performance
- **Google Authentication**: Seamless login with Google OAuth
- **Responsive Design**: Works perfectly on all devices
- **Dark Theme**: Elegant dark interface with crystalline effects

## 🛠️ Technologies Used

### Frontend
- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Beautiful icon library
- **Framer Motion**: Smooth animations
- **GSAP**: Advanced animations for complex effects

### Backend & Database
- **NextAuth.js**: Authentication and session management
- **MongoDB**: NoSQL database for user data and audit logs
- **Mongoose**: MongoDB object modeling

### AI & Data
- **Custom Neural Network**: Built from scratch in TypeScript
- **TwelveData API**: Real-time and historical stock data
- **Advanced Algorithms**: Feedforward neural networks with backpropagation

### UI/UX
- **Spline**: 3D animations and interactive elements
- **Glass Morphism**: Modern glass-like effects
- **Ethereal Design**: Crystalline and mystical visual themes
- **Responsive Layout**: Mobile-first design approach

### Development Tools
- **ESLint**: Code linting and formatting
- **Prettier**: Code formatting
- **Git**: Version control
- **pnpm**: Fast package management

## 🚀 How to Run This Application

### Prerequisites
- Node.js 18+ 
- pnpm (recommended) or npm
- MongoDB database
- Google OAuth credentials (for authentication)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Stock-Market-Prediction-main
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   # or
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   # Database
   MONGODB_URI=your_mongodb_connection_string
   
   # NextAuth
   NEXTAUTH_SECRET=your_nextauth_secret
   NEXTAUTH_URL=http://localhost:3000
   
   # Google OAuth
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   
   # TwelveData API
   TWELVEDATA_API_KEY=your_twelvedata_api_key
   
       # Email (optional)
    SMTP_SERVER=your_smtp_server
    SMTP_USER=your_smtp_username
    SMTP_PASS=your_smtp_password
    ADMIN_ALERT_EMAIL=your_admin_email
   ```

4. **Set up MongoDB**
   - Create a MongoDB database
   - Update the `MONGODB_URI` in your environment variables
   - The application will automatically create necessary collections

5. **Set up Google OAuth**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing one
   - Enable Google+ API
   - Create OAuth 2.0 credentials
   - Add `http://localhost:3000/api/auth/callback/google` to authorized redirect URIs
   - Copy Client ID and Client Secret to your environment variables

6. **Get TwelveData API Key**
   - Sign up at [TwelveData](https://twelvedata.com/)
   - Get your API key from the dashboard
   - Add it to your environment variables

7. **Run the development server**
   ```bash
   pnpm dev
   # or
   npm run dev
   ```

8. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Project Structure

```
Stock-Market-Prediction-main/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   ├── dashboard/         # Main dashboard page
│   ├── login/            # Authentication pages
│   ├── register/
│   └── globals.css       # Global styles
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   ├── HomeRobot.tsx     # Spline animation component
│   └── ...
├── lib/                  # Utility libraries
│   ├── auth.ts           # NextAuth configuration
│   ├── brain-model.ts    # Neural network implementation
│   ├── api.ts            # TwelveData API integration
│   └── mongodb.ts        # Database connection
├── types/                # TypeScript type definitions
└── public/               # Static assets
```

## 🧠 AI Implementation

### Neural Network Architecture
The application features a custom feedforward neural network built from scratch:

- **Input Layer**: Stock price data points
- **Hidden Layers**: Multiple layers with sigmoid activation
- **Output Layer**: Price predictions
- **Backpropagation**: Adaptive learning rate optimization
- **Training**: Real-time model training with user data

### Key AI Features
- **Pattern Recognition**: Identifies market trends and patterns
- **Price Prediction**: Forecasts future stock prices
- **Confidence Scoring**: Provides prediction confidence levels
- **Adaptive Learning**: Improves predictions with more data

## 🎨 Design Philosophy

### Ethereal Theme
The application uses a crystalline, ethereal design language:
- **Dark Background**: Deep blacks and subtle gradients
- **Glass Effects**: Frosted glass and transparency
- **Crystalline Elements**: Sharp, geometric shapes
- **Aurora Effects**: Dynamic background animations
- **Spline Integration**: 3D interactive elements

### User Experience
- **Intuitive Navigation**: Clear, logical flow
- **Responsive Design**: Works on all screen sizes
- **Loading States**: Smooth transitions and feedback
- **Error Handling**: Graceful error management
- **Accessibility**: WCAG compliant design

## 🔧 Development Process

### Phase 1: Foundation
- Set up Next.js with TypeScript
- Implement authentication with NextAuth.js
- Create responsive UI components
- Set up MongoDB database

### Phase 2: AI Implementation
- Built custom neural network from scratch
- Integrated TwelveData API for real-time data
- Implemented prediction algorithms
- Added confidence scoring

### Phase 3: Design & Polish
- Created ethereal design system
- Added Spline 3D animations
- Implemented glass morphism effects
- Optimized performance and animations

### Phase 4: Features & Enhancement
- Added Google OAuth integration
- Implemented file upload functionality
- Created interactive stock charts
- Added audit logging system

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Other Platforms
- **Netlify**: Similar to Vercel deployment
- **Railway**: Good for full-stack applications
- **DigitalOcean**: For custom server deployment

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Spline**: For 3D animation capabilities
- **TwelveData**: For reliable stock market data
- **NextAuth.js**: For seamless authentication
- **Tailwind CSS**: For rapid UI development
- **Lucide**: For beautiful icons

## 📞 Support

If you have any questions or need help:
- Create an issue on GitHub
- Check the documentation in the `/docs` folder
- Review the code comments for implementation details

---

**Built with ❤️ and ☕ by Jatin**

*CrystalStock AI - Where Intelligence Meets Elegance*
