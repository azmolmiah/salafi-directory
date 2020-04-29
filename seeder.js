const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load env vars
dotenv.config({path: './config/config.env'});

// Load models
const Organisation = require('./models/Organisation');

// Connect to database
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  });

// Read JSON files
const organisations = JSON.parse(fs.readFileSync(`${__dirname}/_data/organisations.json`, 'utf-8'))

// Import into db
const importData = async () => {
    try {
        await Organisation.create(organisations);
        console.log('Data imported...');
        process.exit()
    } catch (err) {
        console.error(err)
    }
}

// Delete data
const deleteData = async () => {
    try {
        await Organisation.deleteMany();
        console.log('Data destroyed...');
        process.exit()
    } catch (err) {
        console.error(err)
    }
}

if(process.argv[2] === '-i'){
    importData();
} else if (process.argv[2] === '-d') {
    deleteData();
}