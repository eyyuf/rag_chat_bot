require('dotenv').config();
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI)
    .then(async () => {
        console.log('Connected to MongoDB');

        const db = mongoose.connection.db;
        const usersCollection = db.collection('users');

        // Get all indexes
        const indexes = await usersCollection.indexes();
        console.log('Current indexes:', indexes.map(i => i.name));

        // Drop problematic indexes
        try {
            await usersCollection.dropIndex('name_1');
            console.log('✓ Dropped name_1 index');
        } catch (e) {
            console.log('name_1 index does not exist');
        }

        try {
            await usersCollection.dropIndex('username_1');
            console.log('✓ Dropped username_1 index');
        } catch (e) {
            console.log('username_1 index does not exist');
        }

        // Check final indexes
        const finalIndexes = await usersCollection.indexes();
        console.log('Final indexes:', finalIndexes.map(i => i.name));

        process.exit(0);
    })
    .catch(err => {
        console.error('Connection error:', err);
        process.exit(1);
    });
