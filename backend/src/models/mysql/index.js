const sequelize = require('../../config/mysql');
const Booking = require('./Booking');
const ContactRequest = require('./ContactRequest');
const Media = require('./Media');
const Schedule = require('./Schedule');
const Sport = require('./Sport');
const SportsRequest = require('./SportsRequest');
const Team = require('./Team');
const TeamMember = require('./TeamMember');
const User = require('./User');
const Venue = require('./Venue');

// Assosiations

/* =========================
   USER ASSOCIATIONS
========================= */
// User (Coach) -> Sports
User.hasMany(Sport, { foreignKey: "coach_id", as: "sports" });
Sport.belongsTo(User, { foreignKey: "coach_id", as: "coach" });

/* =========================
   SPORT ASSOCIATIONS
========================= */
// Sport -> Teams
Sport.hasMany(Team, { foreignKey: 'sport_id' });
Team.belongsTo(Sport, { foreignKey: 'sport_id' });

// Sport -> Booking
Sport.hasMany(Booking, { foreignKey: "sport_id" });
Booking.belongsTo(Sport, { foreignKey: "sport_id" });

// Sport -> Schedules
Sport.hasMany(Schedule, { foreignKey: 'sport_id' });
Schedule.belongsTo(Sport, { foreignKey: 'sport_id' });

// Sport -> SportsRequest
Sport.hasMany(SportsRequest, { foreignKey: 'sport_id' });
SportsRequest.belongsTo(Sport, { foreignKey: 'sport_id' });

/* =========================
   TEAM ASSOCIATIONS
========================= */
// Team -> TeamMember
Team.hasMany(TeamMember, { foreignKey: 'team_id' });
TeamMember.belongsTo(Team, { foreignKey: 'team_id' });

// Team -> Booking
Team.hasMany(Booking, { foreignKey: 'team_id' });
Booking.belongsTo(Team, { foreignKey: 'team_id' });

// Team -> Schedule (team1)
Team.hasMany(Schedule, { foreignKey: 'team1_id', as: 'team1Schedules' });
Schedule.belongsTo(Team, { foreignKey: 'team1_id', as: 'team1' });

// Team -> Schedule (team2)
Team.hasMany(Schedule, { foreignKey: 'team2_id', as: 'team2Schedules' });
Schedule.belongsTo(Team, { foreignKey: 'team2_id', as: 'team2' });

/* =========================
   VENUE ASSOCIATIONS
========================= */
// Venue -> Booking
Venue.hasMany(Booking, { foreignKey: 'venue_id' });
Booking.belongsTo(Venue, { foreignKey: 'venue_id' });

// Venue -> Schedule
Venue.hasMany(Schedule, { foreignKey: 'venue_id' });
Schedule.belongsTo(Venue, { foreignKey: 'venue_id' });

// Venue -> SportsRequest
Venue.hasMany(SportsRequest, { foreignKey: 'venue_id' });
SportsRequest.belongsTo(Venue, { foreignKey: 'venue_id' });

module.exports = {
    sequelize,
    Booking,
    ContactRequest,
    Media,
    Schedule,
    Sport,
    SportsRequest,
    Team,
    TeamMember,
    User,
    Venue
}