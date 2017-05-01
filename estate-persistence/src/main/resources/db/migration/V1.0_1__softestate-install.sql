--
-- DB : softproperty postgres
-- Table creation
--
-- Location, vente, terrain
-- villa, appartement, terrain
-- terrain -> vent
-- villa, appartement -> vente et location

-- property -> bien
-- property Type -> (villa, appartement, terrain)
-- property Size
-- property Number of Floor
-- property Number of Room
-- property Description
-- property Media

CREATE TABLE IF NOT EXISTS property (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  reference VARCHAR(15) NOT NULL UNIQUE,
  type_id INTEGER NOT NULL,
  enabled BIT(1) NOT NULL DEFAULT '1',
  start_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE IF NOT EXISTS property_end_date (
  id SERIAL PRIMARY KEY,
  property_id INTEGER NOT NULL,
  end_date TIMESTAMP NOT NULL
);


CREATE TABLE IF NOT EXISTS property_type (
  id SERIAL PRIMARY KEY,
  label VARCHAR(100) NOT NULL
);


CREATE TABLE IF NOT EXISTS property_contract (
  id SERIAL PRIMARY KEY,
  label VARCHAR(50) NOT NULL
);


CREATE TABLE IF NOT EXISTS property_description (
  id SERIAL PRIMARY KEY,
  property_id INTEGER NOT NULL,
  description TEXT NOT NULL
);


CREATE TABLE IF NOT EXISTS property_property_contract  (
  id SERIAL PRIMARY KEY,
  property_id INTEGER NOT NULL,
  property_contract_id INTEGER NOT NULL
);


CREATE TABLE IF NOT EXISTS property_floor_count (
  id SERIAL PRIMARY KEY,
  property_id INTEGER NOT NULL,
  count INTEGER NOT NULL
);


CREATE TABLE IF NOT EXISTS property_location (
  id SERIAL PRIMARY KEY,
  property_id INTEGER NOT NULL,
  location_id INTEGER NOT NULL
);


CREATE TABLE IF NOT EXISTS location (
  id SERIAL PRIMARY KEY,
  country VARCHAR(100) NOT NULL,
  district VARCHAR(100) NOT NULL,
  city VARCHAR(100) NOT NULL
);


CREATE TABLE IF NOT EXISTS neighborhood (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  location_id INTEGER NOT NULL
);


CREATE TABLE IF NOT EXISTS property_room_count (
  id SERIAL PRIMARY KEY,
  property_id INTEGER NOT NULL,
  count INTEGER NOT NULL
);


CREATE TABLE IF NOT EXISTS property_size (
  id SERIAL PRIMARY KEY,
  property_id INTEGER NOT NULL,
  size INTEGER NOT NULL
);


CREATE TABLE IF NOT EXISTS media (
  id SERIAL PRIMARY KEY,
  uri varchar(255) NOT NULL UNIQUE,
  name varchar(255) NOT NULL UNIQUE,
  mime_type varchar(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS property_media (
  property_id INTEGER NOT NULL,
  media_id INTEGER NOT NULL
);


CREATE TABLE IF NOT EXISTS property_price (
  id SERIAL PRIMARY KEY,
  property_id INTEGER NOT NULL,
  price INTEGER NOT NULL
);

-- charges
CREATE TABLE IF NOT EXISTS property_rental_expenses (
  id SERIAL PRIMARY KEY,
  property_id INTEGER NOT NULL,
  cost INTEGER NOT NULL
);


-- our customer is owner of site
CREATE TABLE IF NOT EXISTS customer (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  reference VARCHAR(100)NOT NULL
);


CREATE TABLE IF NOT EXISTS customer_owner(
  owner_id INTEGER NOT NULL,
  customer_id INTEGER NOT NULL
);


CREATE TABLE IF NOT EXISTS owner (
  id SERIAL PRIMARY KEY ,
  reference VARCHAR(100) NOT NULL UNIQUE,
  type_id INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS owner_company_name (
  id SERIAL PRIMARY KEY,
  owner_id INTEGER NOT NULL,
  name VARCHAR(255) NOT NULL
);


CREATE TABLE IF NOT EXISTS owner_type (
  id SERIAL PRIMARY KEY,
  label VARCHAR(100) NOT NULL UNIQUE
);


CREATE TABLE IF NOT EXISTS owner_contact (
  owner_id INTEGER NOT NULL,
  contact_id INTEGER NOT NULL
);


CREATE TABLE IF NOT EXISTS customer_contact (
  customer_id INTEGER NOT NULL,
  contact_id INTEGER NOT NULL
);


CREATE TABLE IF NOT EXISTS owner_property(
  owner_id INTEGER NOT NULL,
  property_id INTEGER NOT NULL
);


CREATE TABLE IF NOT EXISTS contact (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL
);


CREATE TABLE IF NOT EXISTS contact_contact_info(
  contact_info_id INTEGER NOT NULL,
  contact_id INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS contact_contact_type(
  contact_type_id INTEGER NOT NULL,
  contact_id INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS contact_type (
  id SERIAL PRIMARY KEY,
  label VARCHAR(100) NOT NULL
);


CREATE TABLE IF NOT EXISTS contact_info (
  id SERIAL PRIMARY KEY,
  phone VARCHAR(100) NOT NULL UNIQUE
);


CREATE TABLE IF NOT EXISTS login (
  id SERIAL PRIMARY KEY,
  login VARCHAR(100) NOT NULL,
  password VARCHAR(100) NOT NULL,
  enabled bit(1) NOT NULL DEFAULT '1'
);


CREATE TABLE IF NOT EXISTS contact_login (
  contact_id INTEGER NOT NULL,
  login_id INTEGER NOT NULL
);


CREATE VIEW Users AS
  SELECT c.id, c.first_name, c.last_name, ci.phone, l.login, l.password, l.enabled, cu.name as customer
  FROM contact_login AS cl
    INNER JOIN login AS l ON l.Id = cl.login_id
    INNER JOIN contact AS c ON c.Id = cl.contact_id
    INNER JOIN customer_contact AS cc ON cc.contact_id = c.id
    INNER JOIN customer AS cu ON cu.id = cc.customer_id
    LEFT JOIN contact_contact_info AS cci ON cci.contact_id = c.id
    LEFT JOIN contact_info AS ci ON ci.Id = cci.contact_info_id;

/*
CREATE VIEW PropertyDetails AS
  SELECT p.id, p.name, pt.type as property_type, pt.type as contract_type, pd.description, op.owner_id
  FROM property AS p
    INNER JOIN property_type AS pt ON pt.Id = p.type_id
    INNER JOIN property_property_contract AS ppc ON ppc.property_id = p.Id
    INNER JOIN property_contract AS pc ON pc.id = ppc.property_contract_id
    INNER JOIN property_description AS pd ON pd.property_id = p.id
    INNER JOIN owner_property AS op ON op.property_id = p.id;
*/

CREATE VIEW rent_summary AS
  SELECT op.owner_id as id,
    op.owner_id,
         SUM(CASE WHEN p.type_id = 1 THEN 1 ELSE 0 END) AS apartment_count,
         SUM(CASE WHEN p.type_id = 2 THEN 1 ELSE 0 END) AS house_count,
         SUM(CASE WHEN p.type_id = 3 THEN 1 ELSE 0 END) AS land_count
    FROM property AS p
    INNER JOIN owner_property AS op ON p.id = op.property_id
    INNER JOIN property_property_contract AS ppc on p.id = ppc.property_id
    WHERE ppc.property_contract_id = 1 -- rent;
    GROUP BY op.owner_id;


CREATE VIEW sell_summary AS
  SELECT op.owner_id as id,
    op.owner_id,
         SUM(CASE WHEN p.type_id = 1 THEN 1 ELSE 0 END) AS apartment_count,
         SUM(CASE WHEN p.type_id = 2 THEN 1 ELSE 0 END) AS house_count,
         SUM(CASE WHEN p.type_id = 3 THEN 1 ELSE 0 END) AS land_count
  FROM property AS p
    INNER JOIN owner_property AS op ON p.id = op.property_id
    INNER JOIN property_property_contract AS ppc on p.id = ppc.property_id
  WHERE ppc.property_contract_id = 2 -- sell;
  GROUP BY op.owner_id;

--
-- Constraints
--

ALTER TABLE property
ADD CONSTRAINT fk_property_type FOREIGN KEY (type_id) REFERENCES property_type (id);

ALTER TABLE property_property_contract
ADD CONSTRAINT fk_property_contract_property FOREIGN KEY (property_contract_id) REFERENCES property_contract (id),
ADD CONSTRAINT fk_property_property_contract FOREIGN KEY (property_id) REFERENCES property (id) ON DELETE CASCADE;

ALTER TABLE property_description
ADD CONSTRAINT fk_property_description_property FOREIGN KEY (property_id) REFERENCES property (id) ON DELETE CASCADE;

ALTER TABLE owner_company_name
ADD CONSTRAINT fk_owner_name_owner FOREIGN KEY (owner_id) REFERENCES owner (id);

ALTER TABLE property_price
ADD CONSTRAINT fk_property_price_property FOREIGN KEY (property_id) REFERENCES property (id) ON DELETE CASCADE;

ALTER TABLE property_rental_expenses
ADD CONSTRAINT fk_property_rental_expenses_property FOREIGN KEY (property_id) REFERENCES property (id) ON DELETE CASCADE;

ALTER TABLE property_floor_count
ADD CONSTRAINT fk_property_floor_count_property FOREIGN KEY (property_id) REFERENCES property (id) ON DELETE CASCADE;

ALTER TABLE property_room_count
ADD CONSTRAINT fk_property_room_count_property FOREIGN KEY (property_id) REFERENCES property (id) ON DELETE CASCADE;

ALTER TABLE property_size
ADD CONSTRAINT fk_property_size_property FOREIGN KEY (property_id) REFERENCES property (id) ON DELETE CASCADE;

ALTER TABLE property_location
ADD CONSTRAINT fk_property_location_property FOREIGN KEY (property_id) REFERENCES property (id) ON DELETE CASCADE;

ALTER TABLE property_media
ADD CONSTRAINT fk_property_media_property FOREIGN KEY (property_id) REFERENCES property (id) ON DELETE CASCADE,
ADD CONSTRAINT fk_property_property_media FOREIGN KEY (media_id) REFERENCES media (id);


ALTER TABLE property_end_date
ADD CONSTRAINT fk_property_property_en_date FOREIGN KEY (property_id) REFERENCES property (id) ON DELETE CASCADE;

ALTER TABLE owner_contact
ADD CONSTRAINT fk_owner_contact_owner FOREIGN KEY (owner_id) REFERENCES owner (id);

ALTER TABLE contact_contact_info
ADD CONSTRAINT fk_contact_contact_info FOREIGN KEY (contact_info_id) REFERENCES contact_info (id),
ADD CONSTRAINT fk_contact_info_contact FOREIGN KEY (contact_id) REFERENCES contact (id);

ALTER TABLE contact_contact_type
ADD CONSTRAINT fk_contact_contact_type FOREIGN KEY (contact_type_id) REFERENCES contact_type (id),
ADD CONSTRAINT fk_contact_type_contact FOREIGN KEY (contact_id) REFERENCES contact (id);

ALTER TABLE customer_contact
ADD CONSTRAINT fk_customer_contact_contact FOREIGN KEY (customer_id) REFERENCES customer (id);

ALTER TABLE owner
ADD CONSTRAINT fk_owner_owner_type FOREIGN KEY (type_id) REFERENCES owner_type (id);

ALTER TABLE owner_property
ADD CONSTRAINT fk_owner_property_owner FOREIGN KEY (owner_id) REFERENCES owner (id),
ADD CONSTRAINT fk_owner_property_property FOREIGN KEY (property_id) REFERENCES property (id) ON DELETE CASCADE;

ALTER TABLE contact_login
ADD CONSTRAINT fk_contact_login_login FOREIGN KEY (login_id) REFERENCES login (Id),
ADD CONSTRAINT fk_contact_login_contact FOREIGN KEY (contact_id) REFERENCES contact (Id);

ALTER TABLE customer_owner
ADD CONSTRAINT fk_customer_owner_owner FOREIGN KEY (owner_id) REFERENCES owner (Id),
ADD CONSTRAINT fk_customer_owner_customer FOREIGN KEY (customer_id) REFERENCES customer (Id);