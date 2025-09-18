const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

console.log('🚀 Starting Mock IoT Server...');

// Lấy IP local
const os = require('os');
function getLocalIP() {
    const interfaces = os.networkInterfaces();
    for (let iface in interfaces) {
        for (let addr of interfaces[iface]) {
            if (addr.family === 'IPv4' && !addr.internal) {
                return addr.address;
            }
        }
    }
    return 'localhost';
}

const localIP = getLocalIP();

// Lưu lịch sử lệnh
let commandHistory = [];

// Home page
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Mock IoT Server</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 40px; }
                .status { color: green; font-weight: bold; }
                .command { background: #f5f5f5; padding: 10px; margin: 5px; }
            </style>
        </head>
        <body>
            <h1>🚀 Mock IoT Server</h1>
            <p class="status">✅ Server is running!</p>
            <p><strong>📍 Local URL:</strong> http://localhost:${PORT}</p>
            <p><strong>🌐 Network URL:</strong> http://${localIP}:${PORT}</p>
            
            <h3>📡 API Endpoints:</h3>
            <ul>
                <li><code>POST /api/iot/command</code> - Send IoT command</li>
                <li><code>GET /api/commands</code> - View command history</li>
                <li><code>GET /health</code> - Health check</li>
            </ul>
            
            <h3>📋 Recent Commands (${commandHistory.length}):</h3>
            ${commandHistory.slice(0, 10).map(cmd => `
                <div class="command">
                    <strong>${cmd.command}</strong> - 
                    ${cmd.deviceId} - 
                    ${new Date(cmd.timestamp).toLocaleTimeString()}
                </div>
            `).join('')}
        </body>
        </html>
    `);
});

// Health check
app.get('/health', (req, res) => {
    res.json({ 
        status: 'healthy', 
        message: 'Mock IoT Server is running',
        timestamp: new Date().toISOString(),
        commandCount: commandHistory.length
    });
});

// Nhận lệnh IoT
app.post('/api/iot/command', (req, res) => {
    const { command, deviceId, timestamp } = req.body;
    
    console.log('📨 Received command:', { command, deviceId });
    
    // Lưu vào lịch sử
    commandHistory.unshift({
        command,
        deviceId: deviceId || 'unknown-device',
        timestamp: timestamp || new Date().toISOString(),
        receivedAt: new Date().toISOString()
    });
    
    // Giới hạn lịch sử
    if (commandHistory.length > 50) {
        commandHistory = commandHistory.slice(0, 50);
    }
    
    // Phản hồi
    res.json({
        success: true,
        message: `Command '${command}' received successfully`,
        echo: command,
        deviceId,
        serverTime: new Date().toISOString(),
        receivedAt: new Date().toLocaleString('vi-VN')
    });
});

// Xem lịch sử lệnh
app.get('/api/commands', (req, res) => {
    res.json({
        total: commandHistory.length,
        commands: commandHistory
    });
});

// Xóa lịch sử
app.delete('/api/commands', (req, res) => {
    commandHistory = [];
    res.json({ success: true, message: 'Command history cleared' });
});

// Khởi động server
app.listen(PORT, '0.0.0.0', () => {
    console.log('='.repeat(60));
    console.log('🚀 MOCK IOT SERVER STARTED SUCCESSFULLY!');
    console.log('='.repeat(60));
    console.log('📍 Local:    http://localhost:' + PORT);
    console.log('🌐 Network:  http://' + localIP + ':' + PORT);
    console.log('📡 Endpoint: http://' + localIP + ':' + PORT + '/api/iot/command');
    console.log('🔧 Mode:     Virtual IoT Device (Mock)');
    console.log('='.repeat(60));
    console.log('💡 Send POST requests to /api/iot/command to test');
    console.log('💡 Open browser to see web interface');
    console.log('='.repeat(60));
});

// Xử lý tắt server
process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down Mock IoT Server...');
    process.exit(0);
});