module.exports = (sequelize, type) => {
    return sequelize.define('Schedule', {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        exceduteDate: {
            type: type.STRING
        },
        route: {
            type: type.JSON,
            allowNull: false
        },
        routeDistance: {
            type: type.FLOAT
        },
        scheduled: type.BOOLEAN,
        completed: type.BOOLEAN,
        quantityMts: type.JSON
    });
}
