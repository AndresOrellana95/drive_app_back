require('dotenv').config();
const Sequelize = require('sequelize');

const CarModule = require('../cars/models/Car');
const EmployeeModule = require('../employees/models/Employee');
const ScheduleModule = require('../manage/models/Schedule');
const UserLevelModule = require('../auth/models/UserLevel');
const SectorModule = require('../sectors/models/Sector');
const StoreModule = require('../stores/models/Store');
const TeamModule = require('../manage/models/Team');
const ProductsModule = require('../manage/models/Products');
const JobModule = require('../manage/models/Job');
const RatioModule = require('../manage/models/Ratio');
const BinnacleModule = require('../manage/models/Binnacle');

const PSCHEMA = process.env.PGDATABASE;
const PUSER = process.env.PGUSER;
const PPASS = process.env.PGPASSWORD;
const PHOST = process.env.PGHOST;

const sequelize = new Sequelize(
  PSCHEMA, PUSER, PPASS,
  { host: PHOST, schema: process.env.PGDATABASE, dialect: 'postgres', timezone: "-06:00"}
);

const Car = CarModule(sequelize, Sequelize);
const Employee = EmployeeModule(sequelize, Sequelize);
const Schedule = ScheduleModule(sequelize, Sequelize);
const Sector = SectorModule(sequelize, Sequelize);
const Store = StoreModule(sequelize, Sequelize);
const Team = TeamModule(sequelize, Sequelize);
const UserLevel = UserLevelModule(sequelize, Sequelize);
const Product = ProductsModule(sequelize, Sequelize);
const Job = JobModule(sequelize, Sequelize);
const Ratio = RatioModule(sequelize, Sequelize);
const Binnacle = BinnacleModule(sequelize, Sequelize);

Team.belongsTo(Car, { as: 'Car', constraint: true });
UserLevel.hasOne(Employee);
Sector.hasOne(Store);
Employee.hasMany(Team, { as: 'Head', constraint: true });
Team.hasMany(Product);
//Team.hasMany(Schedule);
Ratio.belongsTo(Team, { as: 'TeamRatio' });
Schedule.belongsTo(Team, { as: 'Team' });
Team.hasMany(Schedule);
Schedule.hasMany(Job);
Job.belongsTo(Schedule, { as: 'Schedule' });
Job.belongsTo(Store, { as: 'Store' });

sequelize.sync({force: false}).then(() => {
  console.log("Conexion correcta");
});

module.exports = {
  Car,
  Employee,
  Schedule,
  UserLevel,
  Sector,
  Store,
  Team,
  Product,
  Schedule,
  Job,
  Ratio,
  Binnacle,
  sequelize
}
