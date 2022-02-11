drop table if exists webapp.companies;
drop table if exists federated_credentials;
drop table if exists federated_credentials_provider;
drop table if exists users;
drop table if exists roles;
truncate sessions;

CREATE TABLE roles (
    roleId int,
    roleName varchar(20) unique not null,
    roleLevel int,
    primary key (roleid)
);
INSERT INTO roles (roleId, roleName, roleLevel) VALUES 
	(1, "Administrators", 5), 
    (2, "Organizations", 10),
    (3, "Users", 10);

CREATE TABLE webapp.companies (
    cid char(36),
    email varchar(250) unique not null,
    password char(60),
    name varchar(100) not null,
    description varchar(5000),
    address varchar(200),
    city varchar(100),
    website varchar(200),
    phone varchar(20),
    logo varchar(100),
    primary key (cid)
);

CREATE TABLE users (
    uid char(36),
    email varchar(250) unique not null,
    password char(60),
    firstName varchar(50),
    middleName varchar(50),
    lastName varchar(50),
    picture varchar(200),
    birthday date,
    phone varchar(20),
    gender varchar(10),
    primary key (uid)
);

CREATE TABLE federated_credentials_provider (
    providerId int auto_increment,
    providerName varchar(50) unique not null,
    primary key(providerId)
);

CREATE TABLE federated_credentials (
    uid char(36) not null,
    providerId int not null,
    identifier varchar(100) not null,
    primary key (providerId, identifier),
    foreign key (uid) references users(uid),
    foreign key (providerId) references federated_credentials_provider(providerId)
);
