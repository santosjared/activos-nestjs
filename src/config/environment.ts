
export default ()=>({
    MONGO_URI:process.env.MONGO_URI || 'mongodb://localhost:27017/',
    PORT: parseInt(process.env.PORT ?? '3000', 10),
    JWT_SECRET:process.env.JWT_SECRET || 'default_jwt_secret',
    JWT_REFRESH_SECRET:process.env.JWT_REFRESH_SECRET || 'default_jwt_refresh_secret',
    ROOT_EMAIL:process.env.ROOT_EMAIL || 'admin@gmail.com',
    ROOT_PASSWORD:process.env.ROOT_PASSWORD || 'admin123',
    ROOT_NAME:process.env.ROOT_NAME || 'SuperAdministrador'
})