
export default ()=>({
    MONGO_URI:process.env.MONGO_URI || 'mongodb://localhost:27017/',
    PORT:process.env.PORT || 3000,
    JWT_SECRET:process.env.JWT_SECRET
})