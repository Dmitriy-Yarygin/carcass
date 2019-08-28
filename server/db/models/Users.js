'use strict';

const { Model } = require('objection');

class Users extends Model {
  static get tableName() {
    return 'users';
  }
  static get relationMappings() {
    // Importing models here is a one way to avoid require loops.
    const Rooms = require('./Rooms');

    return {
      rooms: {
        relation: Model.ManyToManyRelation,
        modelClass: Rooms,
        join: {
          from: 'users.id',
          through: {
            // users_rooms is the join table.
            from: 'users_rooms.user_id',
            to: 'users_rooms.room_id'
          },
          to: 'rooms.id'
        }
      }
    };
  }

  static get modifiers() {
    return {
      orderByName(builder) {
        builder.orderBy('email');
      },
      onlyNames(builder) {
        builder.select('email');
      }
    };
  }

  $beforeInsert() {
    this.created_at = new Date().toISOString();
  }

  $beforeUpdate() {
    this.updated_at = new Date().toISOString();
  }
}

module.exports = Users;
