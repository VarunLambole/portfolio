const express = require('express');
const helmet = require('helmet');
const compression = require('compression');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./config/swagger');
const env = require('./config/env');
const { connectDB } = require('./config/database');
const { logger, logRequest } = require('./utils/logger');
const { rateLimitMiddleware } = require('./middleware/rateLimit.middleware');
const { errorHandler, notFoundHandler } = require('./middleware/error.middleware');

// Import Routers
const authRouter = require('./router/authRouter');
const projectRouter = require('./router/projectRouter');
const blogRouter = require('./router/blogRouter');
const contactRouter = require('./router/contactRouter');
const heroRouter = require('./router/heroRouter');
const leetCodeRouter = require('./router/leetcode.route');
const certificateRouter = require('./router/certificateRouter');
const experienceRouter = require('./router/experienceRouter');
const adminRouter = require('./router/adminRouter');

const app = express();

// Connect to Database
connectDB();

// Middleware Stack
app.use(helmet());
app.use(cors({
    origin: env.getAllowedOrigins(),
    credentials: true,
}));
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Advanced Security
// app.use(mongoSanitize()); // Prevent NoSQL injection (Incompatible with Express 5)
// app.use(xss()); // Prevent XSS attacks (Incompatible with Express 5)
// app.use(hpp()); // Prevent HTTP Parameter Pollution (Incompatible with Express 5)

// Rate Limiting (Global)
app.use(rateLimitMiddleware);

// Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// Request Logging
app.use((req, res, next) => {
    logRequest(req);
    next();
});

// Health Check
app.get('/', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        service: 'Portfolio Backend',
    });
});

app.get('/health', (req, res) => {
    const { isConnected } = require('./config/database');
    res.json({
        status: 'healthy',
        uptime: process.uptime(),
        database: isConnected() ? 'connected' : 'disconnected',
        timestamp: new Date().toISOString(),
    });
});

// Mount Routers
app.use('/api/auth', authRouter);
app.use('/api/projects', projectRouter);
app.use('/api/blogs', blogRouter);
app.use('/api/contact', contactRouter);
app.use('/api/hero', heroRouter);
app.use('/api/leetcode', leetCodeRouter);
app.use('/api/certificates', certificateRouter);
app.use('/api/experiences', experienceRouter);
app.use('/api/admin', adminRouter);

// Error Handling
app.use(notFoundHandler);
app.use(errorHandler);

const PORT = env.PORT;

// Only start the HTTP server when run directly (not as a serverless module)
if (require.main === module) {
    const server = app.listen(PORT, () => {
        logger.info(`Server running in ${env.NODE_ENV} mode on port ${PORT}`);
    });

    process.on('SIGTERM', () => {
        logger.info('SIGTERM received. Shutting down gracefully');
        server.close(() => {
            logger.info('Process terminated');
            const { closeDB } = require('./config/database');
            closeDB();
            process.exit(0);
        });
    });

    process.on('SIGINT', () => {
        logger.info('SIGINT received. Shutting down gracefully');
        server.close(() => {
            logger.info('Process terminated');
            const { closeDB } = require('./config/database');
            closeDB();
            process.exit(0);
        });
    });
}

module.exports = app;
