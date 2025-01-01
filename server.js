const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());



// MongoDB Connection
const startServer = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/smartorgandonation');
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1); // Exit the application if DB connection fails
    }

    app.listen(5000, () => {
        console.log('Server is running on http://localhost:5000');
    });
};

// Define the Donor Schema and Model
const donorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    age: { type: Number, required: true },
    organ: { type: String, required: true },
    consent: { type: Boolean, required: true },
    fullName: { type: String },
    mobile: { type: String },
    email: { type: String },
    address: { type: String },
    verificationType: { type: String },
    verificationNumber: { type: String },
});

const Donor = mongoose.model('Donor', donorSchema);

// Routes
app.post('/donor', async (req, res) => {
    const { name, age, organ, consent } = req.body;
    if (!name || !age || !organ || consent === undefined) {
        return res.status(400).json({ message: 'Invalid donor details' });
    }
    const donor = new Donor({ name, age, organ, consent });
    try {
        await donor.save();
        res.status(201).json({ message: 'Donor details saved!' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to save donor details' });
    }
});

app.get('/donors', async (req, res) => {
    try {
        const donors = await Donor.find();
        res.status(200).json(donors);
    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve donor details' });
    }
});

app.put('/donor/:id', async (req, res) => {
    try {
        const { name, age, organ, consent } = req.body;
        const updatedDonor = await Donor.findByIdAndUpdate(req.params.id, { name, age, organ, consent }, { new: true });
        res.status(200).json({ message: 'Donor updated successfully!', donor: updatedDonor });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update donor' });
    }
});

app.delete('/donor/:id', async (req, res) => {
    try {
        await Donor.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Donor deleted successfully!' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete donor' });
    }
});

// Default Route (for testing server)
app.get('/', (req, res) => {
    res.send('Backend is working!');
});

//view donor details


// Start the server
startServer();
