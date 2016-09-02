import Sequelize from 'sequelize';

export const DB = new Sequelize(
    'estate',
    'postgres',
    '1234',
    {
      dialect: 'postgres',
      host: 'localhost'
    }
)

export const Customer = DB.define('customer', {
      name: Sequelize.STRING,
      reference: Sequelize.STRING
    } , {timestamps: false, freezeTableName: true,}
);

export const Contact =  DB.define('contact', {
      first_name: Sequelize.STRING,
      last_name: Sequelize.STRING,
    } , {timestamps: false, freezeTableName: true,}
);

export const Login = DB.define('login', {
      login: Sequelize.STRING,
      password: Sequelize.STRING,
      enabled: Sequelize.BOOLEAN
    } , {timestamps: false, freezeTableName: true,}
);

export const ContactInfo = DB.define('contact_info', {
      phone: Sequelize.STRING
    } , {timestamps: false, freezeTableName: true,}
);

export const ContactContactInfo = DB.define('contact_contact_info', {
        contact_info_id: {type: Sequelize.INTEGER, field: 'contact_info_id'},
        contact_id: {type: Sequelize.INTEGER, field: 'contact_id'},
    } , {timestamps: false, freezeTableName: true,}
);

export const CustomerContact = DB.define('customer_contact', {
      customer_id: Sequelize.INTEGER,
      contact_id: Sequelize.INTEGER
    } , {timestamps: false, freezeTableName: true,}
);

export const ContactLogin = DB.define('contact_login', {
      contact_id: Sequelize.INTEGER,
      login_id: Sequelize.INTEGER
    } , {timestamps: false, freezeTableName: true}
);


export const CustomerOwner = DB.define('customer_owner', {
        owner_id: {type: Sequelize.INTEGER, field: 'owner_id'},
        customer_id: {type: Sequelize.INTEGER, field: 'customer_id'}
    } , {timestamps: false, freezeTableName: true}
);


export const Property = DB.define('property', {
        name: Sequelize.STRING,
        reference: Sequelize.STRING,
        start_date: Sequelize.DATE,
        enabled: Sequelize.BOOLEAN,
        type_id: Sequelize.INTEGER,
    } , {timestamps: false, freezeTableName: true}
);

export const PropertyPropertyContract = DB.define('property_property_contract', {
        property_id: Sequelize.INTEGER,
        property_contract_id: Sequelize.INTEGER
    } , {timestamps: false, freezeTableName: true}
);

export const PropertyDescription = DB.define('property_description', {
        property_id: Sequelize.INTEGER,
        description: Sequelize.STRING
    } , {timestamps: false, freezeTableName: true}
);

export const Media = DB.define('media', {
        name: Sequelize.STRING,
        uri: Sequelize.STRING,
        mime_type: Sequelize.STRING,
    } , {timestamps: false, freezeTableName: true}
);

export const Owner = DB.define('owner', {
        reference: Sequelize.STRING,
        type_id: Sequelize.INTEGER,
    } , {timestamps: false, freezeTableName: true}
);

export const OwnerType = DB.define('owner_type', {
        label: Sequelize.STRING
    } , {timestamps: false, freezeTableName: true}
);

export const OwnerContact = DB.define('owner_contact', {
        owner_id: Sequelize.INTEGER,
        contact_id: Sequelize.INTEGER
    } , {timestamps: false, freezeTableName: true,}
);

export const OwnerCompanyName = DB.define('owner_company_name', {
        owner_id: Sequelize.INTEGER,
        name: Sequelize.STRING
    } , {timestamps: false, freezeTableName: true}
);

export const OwnerProperty = DB.define('owner_property', {
        owner_id: Sequelize.INTEGER,
        property_id: {type: Sequelize.INTEGER, field: 'property_id'}
    } , {timestamps: false, freezeTableName: true}
);

export const PropertyMedia = DB.define('property_media', {
        media_id: {type: Sequelize.INTEGER, field: 'media_id'},
        property_id: {type: Sequelize.INTEGER, field: 'property_id'}
    } , {timestamps: false, freezeTableName: true}
);


export const PropertyType = DB.define('property_type', {
        label: Sequelize.STRING
    } , {timestamps: false, freezeTableName: true}
);

export const RentSummary = DB.define('rent_summary', {
    owner_id: {type: Sequelize.INTEGER, field: 'owner_id'},
    apartment_count: Sequelize.INTEGER,
    house_count: Sequelize.INTEGER,
    land_count: Sequelize.INTEGER
    } , {timestamps: false, freezeTableName: true,}
);

export const SellSummary = DB.define('sell_summary', {
        owner_id: {type: Sequelize.INTEGER, field: 'owner_id'},
        apartment_count: Sequelize.INTEGER,
        house_count: Sequelize.INTEGER,
        land_count: Sequelize.INTEGER
    } , {timestamps: false, freezeTableName: true}
);

Customer.belongsToMany(Contact, { through: CustomerContact, foreignKey: 'customer_id' });
Customer.belongsToMany(Owner, { through: CustomerOwner, foreignKey: 'customer_id' });

Contact.belongsToMany(Customer, { through: CustomerContact, foreignKey: 'contact_id' });
Contact.belongsToMany(ContactInfo, {as: 'ContactInfo', through: ContactContactInfo, foreignKey: 'contact_id' });
Contact.belongsToMany(Login, { through: ContactLogin, foreignKey: 'contact_id' });
Contact.belongsToMany(Owner, { through: OwnerContact, foreignKey: 'contact_id' });

ContactInfo.belongsToMany(Contact, { through: ContactContactInfo, foreignKey: 'contact_info_id' });

Login.belongsToMany(Contact, { through: ContactLogin, foreignKey: 'login_id' });

Owner.belongsToMany(Customer, { through: CustomerOwner, foreignKey: 'owner_id' });
Owner.belongsToMany(Contact, { through: OwnerContact, foreignKey: 'owner_id' });
Owner.belongsToMany(Property, { through: OwnerProperty, foreignKey: 'owner_id' });

Owner.hasOne(OwnerCompanyName, { as:'OwnerCompanyName', foreignKey: 'owner_id' });
Owner.hasOne(RentSummary, {as: 'RentSummary', foreignKey: 'owner_id' });
Owner.hasOne(SellSummary, {as: 'SellSummary', foreignKey: 'owner_id' } );

Property.belongsToMany(Owner, { through: OwnerProperty, foreignKey: 'property_id' });
Property.hasOne(PropertyDescription, {as: 'PropertyDescription', foreignKey: 'property_id' });
Property.hasOne(PropertyPropertyContract, {as: 'PropertyPropertyContract', foreignKey: 'property_id' });
Property.belongsToMany(Media, {through: PropertyMedia, foreignKey: 'property_id' });
Media.belongsToMany(Property, {through: PropertyMedia, foreignKey: 'media_id' });

/*
 * User view for UI display need
 * */
export const User = DB.define('user', {
      first_name: Sequelize.STRING,
      last_name: Sequelize.STRING,
      login: Sequelize.STRING,
      password: Sequelize.STRING,
      phone: Sequelize.STRING,
      enabled: Sequelize.BOOLEAN,
      customer: Sequelize.STRING
    } , {timestamps: false, tableName: 'users'}
);


DB.sync({force: false});

