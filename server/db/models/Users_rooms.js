'use strict';

const { Model } = require('objection');

class Users_rooms extends Model {
  static get tableName() {
    return 'users_rooms';
  }

  $beforeInsert() {
    this.created_at = new Date().toISOString();
  }

  $beforeUpdate() {
    this.updated_at = new Date().toISOString();
  }
}

module.exports = Users_rooms;
