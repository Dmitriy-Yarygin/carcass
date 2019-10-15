#!/usr/bin/env bash 
echo
echo ">>>>>>>>>>> knex migrate:rollback --all"
echo
knex migrate:rollback --all
echo
echo ">>>>>>>>>>> knex migrate:latest"
echo
knex migrate:latest
echo
echo ">>>>>>>>>>> knex seed: run"
echo
knex seed:run