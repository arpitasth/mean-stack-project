var express = require('express');
var router = express.Router();
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');
chai.should();

chai.use(chaiHttp);

describe('posts API', () => {

  /**
   * Test the Login  Route
   */
   describe('POST /api/auth', () =>{
    it('It should get all the posts', (done)=> {
      const user = {
        "email": 'test@test1.com',
        "password": '1234567890'
      }
      chai.request('http://localhost:3000/api/auth')
          .post('/login')
          .send(user)
          .end((err, response) =>{
            response.should.have.status(200);
            done();
          })
        //done();
    })
   })
  /**
   * Test the Register  Route
   */
   describe('POST /api/auth', () =>{
    it('It should get all the posts', (done)=> {
      const user = {
        "email": 'test@test1.com',
        "password": '1234567890'
      }
      chai.request('http://localhost:3000/api/auth')
          .post('/register')
          .send(user)
          .end((err, response) =>{
            response.should.have.status(200);
            done();
          })
        //done();
    })
   })
})
