const sinon      = require('sinon');
const request    = require('supertest');
const { expect } = require('chai');
const express = require('express');

const app        = require('../server');
const pool       = require('../configs/db_config');
const Room       = require('../models/roomModel');
const { getByInviteCode, checkUserInRoom, addUserToRoom} = require('../models/roomModel');

const testApp = express();
testApp.use(express.json());
testApp.use((req, res, next) => {
  req.session = { user_id: 1};
  next();
});
testApp.use(app);

describe('Room Routes', () => {
  beforeEach(() => {
    sinon.restore();
  });

  describe('GET /api/rooms/:id', () => {
    it('should return the room when id exists', async () => {

      sinon.stub(pool, 'query')
           .callsArgWith(2, null, { rows: [{
             room_id:   1,
             room_name: 'Study Group',
             invite_code: 'XYZ'
           }] });

      const res = await request(testApp)
        .get('/api/rooms/1');

      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('room_name', 'Study Group');
    });

    it('should return 400 when room id is invalid', async () => {
      const res = await request(testApp)
        .get('/api/rooms/invalid');

      expect(res.status).to.equal(400);
      expect(res.body).to.have.property('message', 'Invalid room ID');
    });
  });

  describe('POST /api/rooms', () => {
    it('should create a room with valid input', async () => {
      sinon.stub(pool, 'query').callsArgWith(2, null, { 
        rows: [{
            room_id:   1,
            user_id:   1,
            room_name: 'team2D',
            invite_code: 'abc123'
        }] 
      });

      const res = await request(testApp)
        .post('/api/rooms')
        .send({ roomName: 'team2D' });

      expect(res.status).to.equal(201);
      expect(res.body).to.have.property('message', 'Room has successfully been created!');
      expect(res.body.room).to.have.property('room_name', 'team2D');
    });

    it('should return 400 if roomName is missing', async () => {
      const res = await request(testApp)
        .post('/api/rooms')
        .send({});

      expect(res.status).to.equal(400);
      expect(res.body).to.have.property('message','Room name is required to continue.');
    });
  });

  describe('POST /api/joinRoom', () => {
    // beforeEach(() => {
    //   sinon.stub(Room, 'getByInviteCode').resolves({
    //     room_id:   1,
    //     room_name: 'MagicRoom',
    //     invite_code: 'MAGIC99'
    //   });
    // });

    it('should let the user join when invite code is valid', async () => {
      sinon.stub({ getByInviteCode }, 'getByInviteCode').resolves({
        room_id: 1,
        room_name: 'MagicRoom',
        invite_code: 'MAGIC99'
      });
      //sinon.stub({ getByInviteCode }, 'getByInviteCode').callsFake(getByInviteCodeStub);
      sinon.stub(Room, 'checkUserInRoom').resolves(false);
      sinon.stub(Room, 'addUserToRoom').resolves(true);

      const res = await request(testApp)
        .post('/api/joinRoom')
        .send({ inviteCode: 'MAGIC99' });
      expect(getByInviteCode.calledWith('MAGIC99')).to.be.true;
      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('message','Joined room!');
    });

    it('should return 400 if inviteCode is missing', async () => {
      const res = await request(testApp)
        .post('/api/joinRoom')
        .send({});

      expect(res.status).to.equal(400);
      expect(res.body).to.have.property('message', 'User ID and invite code required');
    });

    it('should return 404 if the invite code does not exist', async () => {
      //Room.getByInviteCode.resolves(null);
      sinon.stub({ getByInviteCode }, 'getByInviteCode').resolves(null);

      const res = await request(testApp)
        .post('/api/joinRoom')
        .send({ inviteCode: 'NOPE' });

      expect(res.status).to.equal(404);
      expect(res.body).to.have.property('message','Room not found');
    });

    it('should return 400 if user is already in the room', async () => {
      sinon.stub({getByInviteCode}, 'getByInviteCode').resolves({
        room_id: 1,
        room_name: 'MagicRoom', 
        invite_code: 'MAGIC99'
      });
      //sinon.stub({ getByInviteCode }, 'getByInviteCode').callsFake(getByInviteCodeStub);
      sinon.stub ({ checkUserInRoom }, 'checkUserInRoom').resolves(true);

      const res = await request(testApp)
        .post('/api/joinRoom')
        .send({ inviteCode: 'MAGIC99' });

      expect(getByInviteCode.calledWith('MAGIC99')).to.be.true;
      expect(res.status).to.equal(400);
      expect(res.body).to.have.property('message','User already in room!');
    });
  });
});
