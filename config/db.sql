drop table if exists webapp.federated_credentials;
drop table if exists webapp.federated_credentials_provider;
drop table if exists webapp.emails;
drop table if exists webapp.users;
drop table if exists webapp.roles;
drop table if exists webapp.jobs;
drop table if exists webapp.skills;
drop table if exists webapp.jobQualifications;
drop table if exists webapp.academicQualifications;
drop view if exists vwAuth;
truncate webapp.sessions;

CREATE TABLE webapp.roles (
    roleId int auto_increment,
    roleName varchar(20) unique not null,
    primary key (roleid)
);
Insert into roles (roleName) values ("Administrators"), ("Employers"), ("Applicants"), ("Users");


CREATE TABLE webapp.users (
    uid char(36),
    email varchar(250) unique not null,
    password char(60),
    firstName varchar(50),
    middleName varchar(50),
    lastName varchar(50),
    picture varchar(200),
    birthday datetime,
    phone varchar(20),
    gender varchar(10),
    primary key (uid)
);

CREATE TABLE webapp.federated_credentials_provider (
    providerId int auto_increment,
    providerName varchar(50) unique not null,
    primary key(providerId)
);

CREATE TABLE webapp.federated_credentials (
    uid char(36) not null,
    providerId int not null,
    identifier varchar(100) not null,
    primary key (providerId, identifier),
    foreign key (uid) references users(uid),
    foreign key (providerId) references federated_credentials_provider(providerId)
);

CREATE TABLE webapp.jobs (
    jobId char(36),
    companyId char(36) not null, 
    title varchar(100) not null,
    description varchar(1000),
    vacancies int not null,
    experience int,
    address varchar(1000),
    district varchar(1000),
    primary key (jobId)
);

CREATE TABLE webapp.skills (
    skillName varchar(100) not null,
    jobId char(36) not null,
    proficiency ENUM('Beginner', 'Intermediate', 'Advanced') not null,
    primary key (skillName, jobId),
    foreign key (jobId) references jobs(jobId)
);

CREATE TABLE webapp.academicQualifications (
    qId char(36),
    level varchar(100) not null,
    discipline varchar(100) not null,
    degree varchar(100) not null,
    primary key (qid)
);

CREATE TABLE webapp.jobQualifications (
    jobId char(36) not null,
    qId varchar(36) not null,
    primary key (jobId, qId),
    foreign key (jobId) references jobs(jobId),
    foreign key (qId) references academicQualifications(qId)
);

CREATE OR REPLACE VIEW vwAuth AS
    SELECT u.uid, email, password, providerName, identifier
    FROM users AS u
    LEFT JOIN federated_credentials AS fc ON fc.uid = u.uid
    LEFT JOIN federated_credentials_provider AS fcp ON fcp.providerID = fc.providerID;

CREATE OR REPLACE VIEW vwUser AS
	SELECT u.uid, email, firstName, middleName, lastName, picture, birthday, phone, gender, providerName, identifier
    FROM users AS u
    LEFT JOIN federated_credentials AS fc ON fc.uid = u.uid
    LEFT JOIN federated_credentials_provider AS fcp ON fcp.providerID = fc.providerID;

select * from vwAuth where email = 'yednapnevus2@gmail.com';
select * from vwAuth where uid = '97bfb1d5-1cac-4943-8f5f-f8639dfbfabe';