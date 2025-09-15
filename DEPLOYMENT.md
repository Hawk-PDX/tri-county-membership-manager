# Deployment Guide - Tri-county Membership Manager

## Deploy to Render

This application is configured for easy deployment to Render using the included `render.yaml` configuration file.

### Option 1: Using Render.yaml (Recommended)

1. **Fork/Clone the repository** to your GitHub account
2. **Connect to Render**:
   - Go to [Render Dashboard](https://dashboard.render.com/)
   - Click "New" > "Blueprint"
   - Connect your GitHub repository
   - Select the repository containing this project
3. **Deploy**: Render will automatically detect the `render.yaml` file and deploy your application
4. **Access your app**: Your app will be available at `https://tri-county-membership-manager.onrender.com` (or your custom domain)

### Option 2: Manual Setup

1. **Create a new Web Service** on Render
2. **Configure the service**:
   - **Environment**: Node
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Plan**: Free (or paid as needed)
3. **Set Environment Variables**:
   - `NODE_ENV=production`
   - `PORT=10000`
4. **Deploy**: Click "Create Web Service"

### Environment Variables

The application currently runs with default settings. For production use, you may want to add:

- Database connection strings (when implementing persistent storage)
- API keys for external services
- Custom configuration settings

### Custom Domain

To use a custom domain:
1. Go to your service settings on Render
2. Navigate to "Custom Domains"
3. Add your domain and follow the DNS configuration instructions

### Monitoring

Render provides built-in monitoring for:
- Application logs
- Performance metrics
- Uptime monitoring
- Error tracking

Access these through your Render dashboard.

## Local Development

To run locally:

```bash
npm install
npm run dev
```

The app will be available at `http://localhost:3000`

## Build and Test

```bash
# Build the application
npm run build

# Start production server
npm start

# Run linting
npm run lint
```