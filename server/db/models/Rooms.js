'use strict';

const { Model } = require('objection');

class Rooms extends Model {
  static get tableName() {
    return 'rooms';
  }

  static get relationMappings() {
    // Importing models here is a one way to avoid require loops.
    const Users = require('./Users');

    return {
      users: {
        relation: Model.ManyToManyRelation,
        modelClass: Users,
        join: {
          from: 'rooms.id',
          through: {
            // users_rooms is the join table.
            from: 'users_rooms.room_id',
            to: 'users_rooms.user_id'
          },
          to: 'users.id'
        }
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

module.exports = Rooms;
