const Booking = require('../models/mysql/Booking');
const Sport = require('../models/mysql/Sport'); // [FIX]: Added missing import
const Venue = require('../models/mysql/Venue'); // [FIX]: Added missing import
const nodemailer = require('nodemailer');

exports.createBooking = async (req, res) => {
    try {
        const { 
            role, user_name, user_email, university_id,
            sport_id, team_name, venue_id, date, 
            start_time, end_time, event_name, additional_notes 
        } = req.body;

        // const dateInt = date ? parseInt(date.replace(/-/g, '')) : null;

        const newBooking = await Booking.create({
            role,
            user_name,
            email: user_email,
            university_id,
            sport_id,
            team_name, 
            venue_id,
            date,
            start_time,
            end_time,
            event_name,
            additional_notes,
            status: 'Pending'
        });

        res.status(201).json({ message: "Booking request submitted successfully", booking: newBooking });
    } catch (error) {
        console.error("Booking Submission Error:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

exports.getPendingBookings = async (req, res) => {
    try {
        const requests = await Booking.findAll({
            where: { status: 'Pending' },
            include: [
                { model: Sport, attributes: ['sport_name'] },
                { model: Venue, attributes: ['name'] }
            ]
        });
        res.status(200).json(requests);
    } catch (error) {
        console.error("Fetch Error:", error);
        res.status(500).json({ message: "Failed to fetch bookings" });
    }
};

// [FIXED]: Added Logic for Rejection Reason and Email Notifications
exports.updateBookingStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, reason, user_email, event_name } = req.body;

        const booking = await Booking.findByPk(id);
        if (!booking) return res.status(404).json({ message: "Booking not found" });

        // 1. Update the database first
        await booking.update({ 
            status, 
            rejection_reason: status === 'Rejected' ? reason : null 
        });

        // 2. Automated Email logic
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS // Your 16-character App Password
            }
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: user_email,
            subject: `Sports Hub: Your request for ${event_name} is ${status}`,
            text: status === 'Approved' 
                ? `Great news! Your booking for ${event_name} has been approved.` 
                : `We regret to inform you that your booking for ${event_name} was rejected. Reason: ${reason}`
        };

        // This line sends the email automatically
        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: "Status updated and email sent!" });

    } catch (error) {
        console.error("Email Error:", error);
        res.status(500).json({ message: "Error processing request" });
    }
};

/** Get all approved bookings (Past + Future) */
exports.getAllApprovedBookings = async (req, res) => {
    try {
        const bookings = await Booking.findAll({
            where: { status: 'Approved' },
            include: [
                {
                    model: Sport,
                    attributes: ["sport_id", "sport_name"]
                },
                {
                    model: Venue,
                    attributes: ["venue_id", "name", "location"]
                }
            ],
            order: [['date', 'DESC'], ['start_time', 'ASC']]
        });

        res.status(200).json(bookings);
    } catch (error) {
        console.error('Error fetching approved bookings: ', error);
        res.status(500).json({ message: 'Failed to load bookings' });
    }
}