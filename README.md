# Scheduly: Appointments scheduler

![App Screenshot](https://ik.imagekit.io/wig4h1dj7ks/Screenshot%202024-03-20%20223627_rK2Ccs0ru.png?updatedAt=1710954574274)

![App Screenshot](https://ik.imagekit.io/wig4h1dj7ks/Screenshot%202024-03-20%20223646_dVlaUawqG.png?updatedAt=1710954574242)

Scheduly is a appointment scheduling application, designed to streamline the process of booking appointments. Similar to Calendly, Scheduly provides a user-friendly interface where individuals can view available time slots and book appointments with ease. 

## Installation

This application can be installed in two ways:
* Using Docker (Production Only | Recommended)
* Manual Installation 

For both the cases the application runs on port 3000

### 1. Installation using Docker
Please note: This method can only be used for production. For development, kindly follow manual Installation

1. Once the application is cloned, run `cp .env.example .env` to create a `.env` file by copying the `.env.example` file given. For the ease of setup, the .env file comes prefilled with data, however add your own credentials if required.

2. If Docker Process is running, run `docker compose up -d` (for legacy version run `docker-compose up -d`) which will initiate the build processes.

3. Once the containers are built and running, enter into interactive shell of web container using the following command: `docker exec -it scheduly_app /bin/sh`. Put proper container name, however in our case it is supposed to be `scheduly_app`.

4. Once inside the shell run `sh ./scripts/migrate.sh` to generate schemas and migrate the schema to the database

### Manual Installation
Note: Before starting manual installation keep your PostgreSQL database service ready as it is required during setup

1. 1. Once the application is cloned, run `cp .env.example .env` to create a `.env` file by copying the `.env.example` file given. For the ease of setup, the .env file comes prefilled with data, however add your own credentials if required.

2. Run `npm install` to install dependencies
3. Run `npm run migrate` to generate schemas and migrate to database.
3. Run `npm run dev` to start development

*To build the application for production:*
1. Run `npm run build` for building the application
2. Use `npm start` to start the server and listen.


## Application Architecture

This application employs a standard 3-tier web application architecture, encompassing a client, server, and database. This structure is designed to facilitate scalability in the future, if necessary. Moreover, the application is containerized, enhancing its portability and ease of deployment.

This application was written using NextJS and uses NextJS Actions to communicate with server, and uses PostgreSQL for storing data. Commications with database is done using DrizzleORM.

Adminer is used to monitor database.

## Project Structure

Project structure is as follows:

* __public:__ for hosting static files
* __scripts:__ for various scripts that can be run inside container
* __src:__ source files
    * __app:__ main application files
        * __[page]:__ files for a given page
            * __components:__ page level components
            * **_actions.tsx:** file to handle actions used by the given page (`_` is prepended to imply its not a component)
            * __loading.tsx:__ component for handling loading state
            * __page.tsx:__ main component for the given page
        * __globals.css:__ Global CSS file
        * __layout.tsx:__ Main layout of the application
        * __page.tsx:__ component for rendering homepage, but acts as an entrypoint in this case.
        * __favicon:__ Favicon for the application
    * __components:__ For top-level components
    * __database:__ for managing database 
        * __index.tsx:__ initialises and exports database object 
        * __migrate.tsx:__ migrates generated schema using DrizzleORM
        * __schema.tsx:__ schemas for DrizzleORM for various entities used in the application
    * __utils:__ for storing files for misc and utitilites 
        * __declarations:__ for various declarations used in the application

## Assumptions made during development

For the development of this application I've made the following assumptions:

* Each appointment lasts for about 30 minutes only
* User refreshes the page after booking an appointment
* SSL/TLS is not used to connect to PostgreSQL
* User is available on all the days initially chosen during creating the schedule

## Possible enhancements

If given more time, the following features could be implemented:

* An authentication system
* See bookings made across different schedules by a user (currently bookings for one particular schedule can be seen)
* Edit and delete schedules
* Postpone bookings
* Better Error handling and validation of data