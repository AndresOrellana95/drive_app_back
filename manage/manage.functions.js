const { Store, Employee, Schedule, Team, Car, Job, Product, sequelize } = require('../config/db');

exports.manageGetDots = async (dots) => {
    let dotsCollection = [];
    await dots.forEach( async (s) => {
        const store = await Store.findOne({
            where: {
                latitude: s.latitude,
                longitude: s.longitude
            }
        });
        dotsCollection.push(store);
    });
    return dotsCollection;
}
