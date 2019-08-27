'use strict';

const { Model } = require('objection');

// Users model.
class Users extends Model {
  static get tableName() {
    return 'users';
  }
}

module.exports = Users;
