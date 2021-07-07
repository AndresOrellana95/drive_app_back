module.exports = (sequelize, type) => {
    return sequelize.define('Img', {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: type.STRING,
        content: type.TEXT
    });
}