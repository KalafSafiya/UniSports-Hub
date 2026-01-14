const sequelize = require('../../config/mysql');

module.exports = {
    sequelize,
    Booking: require('./Booking'),
    ContactRequest: require('./ContactRequest'),
    Media: require('./Media'),
    Schedule: require('./Schedule'),
    Sport: require('./Sport'),
    SportsRequest: require('./SportsRequest'),
    Team: require('./Team'),
    TeamMember: require('./TeamMember'),
    User: require('./User'),
    Venue: require('./Venue')
}