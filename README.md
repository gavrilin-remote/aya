# Setup

Run the `npm i` command to install packages.

## Database

* Run `docker-compose up` to install cotainer with postgreSQL
* Go to `data` folder
* Run `npm run extension:create` command to initialize databse
* Run `npm run migration:up` command to run migrations

## Dump

To import dump file into db

* Go to `importer` folder
* Run `npm run db:import` command to start importing dump file

## API

To run api

* Go to `api` folder
* Run `npm run start:api` command to start express app
