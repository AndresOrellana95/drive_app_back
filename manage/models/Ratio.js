module.exports = (sequelize, type) => {
    return sequelize.define('Ratio', {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        blancaLtx: type.FLOAT,
        blancaBrill: type.FLOAT,
        blancaOpt: type.FLOAT,
        amrBrill: type.FLOAT,
        azulBrill: type.FLOAT,
        blancaAntic: type.FLOAT,
        blancaTopCover: type.FLOAT 
    });
}
