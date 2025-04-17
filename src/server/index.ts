/* eslint-env node */
/* global process */
import 'dotenv/config';
import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';

// Node.js process tiplerini doğrudan kullanalım
/// <reference types="node" />

const app = express();
const port = process.env.PORT || 3001;
const corsOriginEnv = process.env.CORS_ORIGIN || 'http://localhost:5173';
const corsOrigins = corsOriginEnv.split(',');

console.log(`Sunucu başlatılıyor: Port ${port}`);
console.log(`CORS origins:`, corsOrigins);

// CORS Middleware - Frontendden gelen isteklere izin ver
app.use(cors({
  origin: (origin, callback) => {
    // origin olmayabilir (örn. Postman istekleri)
    if (!origin) return callback(null, true);
    
    // İzin verilen kaynaklardan biriyse kabul et
    if (corsOrigins.includes(origin)) {
      return callback(null, true);
    }
    
    // Geliştirme ortamında localhost isteklerine izin ver
    if (process.env.NODE_ENV !== 'production' && origin.match(/^http:\/\/localhost:/)) {
      return callback(null, true);
    }
    
    callback(new Error('CORS politikası tarafından engellenmiştir.'));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// JSON Body Parser
app.use(express.json());

// Sunucu durumunu kontrol etmek için basit endpoint
app.get('/', (req, res) => {
  res.json({ status: 'API çalışıyor', timestamp: new Date() });
});

// Routes
// Burada diğer route'ları ekleyebilirsiniz

// Error handling
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: Error, req: Request, res: Response, _next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Bir hata oluştu'
  });
});

app.listen(port, () => {
  console.log(`Sunucu başarıyla başlatıldı: http://localhost:${port}`);
  console.log(`Node.js environment: ${process.env.NODE_ENV || 'development'}`);
}); 