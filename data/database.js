import Sequelize from 'sequelize';

const DB = new Sequelize(
    'estate',
    'postgres',
    '1234',
    {
      dialect: 'postgres',
      host: 'localhost'
    }
)

const Customer = DB.define('customer', {
      name: Sequelize.STRING,
      reference: Sequelize.STRING
    } , {timestamps: false, freezeTableName: true,}
);

const Contact =  DB.define('contact', {
      first_name: Sequelize.STRING,
      last_name: Sequelize.STRING,
    } , {timestamps: false, freezeTableName: true,}
);

const Login = DB.define('login', {
      login: Sequelize.STRING,
      password: Sequelize.STRING,
      enabled: Sequelize.BOOLEAN
    } , {timestamps: false, freezeTableName: true,}
);

const ContactInfo = DB.define('contact_info', {
      email: Sequelize.STRING
    } , {timestamps: false, freezeTableName: true,}
);

const CustomerContact = DB.define('customer_contact', {
      customer_id: Sequelize.INTEGER,
      contact_id: Sequelize.INTEGER
    } , {timestamps: false, freezeTableName: true,}
);

const ContactLogin = DB.define('contact_login', {
      contact_id: Sequelize.INTEGER,
      login_id: Sequelize.INTEGER
    } , {timestamps: false, freezeTableName: true}
);


const CustomerOwner = DB.define('customer_owner', {
        owner_id: Sequelize.INTEGER,
        customer_id: Sequelize.INTEGER
    } , {timestamps: false, freezeTableName: true}
);


const Property = DB.define('property', {
        name: Sequelize.STRING,
        reference: Sequelize.STRING,
        start_date: Sequelize.DATE,
        enabled: Sequelize.BOOLEAN,
        type_id: Sequelize.INTEGER,
    } , {timestamps: false, freezeTableName: true}
);

const Owner = DB.define('owner', {
        reference: Sequelize.STRING,
        type_id: Sequelize.INTEGER,
    } , {timestamps: false, freezeTableName: true}
);

const OwnerType = DB.define('owner_type', {
        label: Sequelize.STRING
    } , {timestamps: false, freezeTableName: true}
);

const OwnerContact = DB.define('owner_contact', {
        owner_id: Sequelize.INTEGER,
        contact_id: Sequelize.INTEGER
    } , {timestamps: false, freezeTableName: true,}
);

const OwnerName = DB.define('owner_name', {
        owner_id: Sequelize.INTEGER,
        name: Sequelize.STRING
    } , {timestamps: false, freezeTableName: true}
);

const OwnerProperty = DB.define('owner_property', {
        owner_id: Sequelize.INTEGER,
        property_id: {type: Sequelize.INTEGER, field: 'property_id'}
    } , {timestamps: false, freezeTableName: true}
);


const PropertyType = DB.define('property_type', {
        reference: Sequelize.STRING,
    } , {timestamps: false, freezeTableName: true}
);

const RentSummary = DB.define('rent_summary', {
    owner_id: {type: Sequelize.INTEGER, field: 'owner_id'},
    apartment_count: Sequelize.INTEGER,
    house_count: Sequelize.INTEGER,
    land_count: Sequelize.INTEGER
    } , {timestamps: false, freezeTableName: true,}
);

const SellSummary = DB.define('sell_summary', {
        owner_id: {type: Sequelize.INTEGER, field: 'owner_id'},
        apartment_count: Sequelize.INTEGER,
        house_count: Sequelize.INTEGER,
        land_count: Sequelize.INTEGER
    } , {timestamps: false, freezeTableName: true,}
);

Customer.belongsToMany(Contact, { through: CustomerContact, foreignKey: 'customer_id' });
Customer.belongsToMany(Owner, { through: CustomerOwner, foreignKey: 'customer_id' });

Contact.belongsToMany(Customer, { through: CustomerContact, foreignKey: 'contact_id' });
Contact.belongsToMany(Login, { through: ContactLogin, foreignKey: 'contact_id' });
Contact.belongsToMany(Owner, { through: OwnerContact, foreignKey: 'contact_id' });

Login.belongsToMany(Contact, { through: ContactLogin, foreignKey: 'login_id' });

Owner.belongsToMany(Customer, { through: CustomerOwner, foreignKey: 'owner_id' });
Owner.belongsToMany(Contact, { through: OwnerContact, foreignKey: 'owner_id' });
Owner.belongsToMany(Property, { through: OwnerProperty, foreignKey: 'owner_id' });

Owner.hasOne(OwnerName, { as:'OwnerName', foreignKey: 'owner_id' });
Owner.hasOne(RentSummary, {as: 'RentSummary', foreignKey: 'owner_id' });
Owner.hasOne(SellSummary, {as: 'SellSummary', foreignKey: 'owner_id' } );

Property.belongsToMany(Owner, { through: OwnerProperty, foreignKey: 'property_id' });
Property.hasOne(PropertyType);

/*
 * User view for UI display need
 * */
DB.define('user', {
      first_name: Sequelize.STRING,
      last_name: Sequelize.STRING,
      login: Sequelize.STRING,
      password: Sequelize.STRING,
      email: Sequelize.STRING,
      enabled: Sequelize.BOOLEAN,
      customer: Sequelize.STRING
    } , {timestamps: false, tableName: 'users'}
);


DB.sync({force: false});

export default DB;
