var express = require('express');
var router = express.Router();
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');
chai.should();

chai.use(chaiHttp);

describe('posts API', () => {

  /**
   * Test the GET Route
   */
  describe('GET /api/posts', () =>{
    it('It should get all the posts', (done)=> {
      chai.request('http://localhost:3000/api/posts')
          .get('/')
          .end((err, response) =>{
            response.should.have.status(200);
            done();
          })
        //done();
    })

    it('It should NOT get all the posts', (done)=> {
      chai.request('http://localhost:3000/api')
          .get('/')
          .end((err, response) =>{
            response.should.have.status(404);
          })
          done();
    })
  })

  /**
   * Test the GET By ID Route
   */
   describe('GET /api/posts/:id', () =>{
    it('It should get all the posts BY ID', (done)=> {
      const postId = '60ab1d1a57efb02178a3f596'
      chai.request('http://localhost:3000/api/posts')
          .get('/'+ postId)
          .end((err, response) =>{
            response.should.have.status(200);
            response.should.have.property('_id');
            response.should.have.property('title');
            response.should.have.property('content');
          })
          done();
    })
  })

  /**
   * Test the POST Route
   */
   describe('POST /api/posts/', () =>{
    it('It should get all the posts BY ID', (done)=> {
      const post = {
        'title': 'Test',
        'content': 'Test Content'
      }
      chai.request('http://localhost:3000/api/posts')
          .post('/')
          .send(post)
          .end((err, response) =>{
            response.should.have.status(200);
          })
          done();
    })

    it('It should not get all the posts BY ID', (done)=> {
      const post = {
        'title': 'Test',
        'content': 'Test Content'
      }
      chai.request('http://localhost:3000/api/post')
          .post('/')
          .send(post)
          .end((err, response) =>{
            response.should.have.status(404);
          })
          done();
    })
  })


  /**
   * Test the PUT Route
   */
   describe('PUT /api/posts/:postId', () =>{
    it('It should update the posts BY ID', (done)=> {
      const post = {
        'title': 'Test',
        'content': 'Test Content'
      }
      const postId = '60ab1d1a57efb02178a3f596'
      chai.request('http://localhost:3000/api/posts')
          .put('/'+ postId)
          .send(post)
          .end((err, response) =>{
            response.should.have.status(200);
          })
          done();
    })
  })

  /**
   * Test the DELETE Route
   */
   describe('DELETE /api/posts/:postId', () =>{
    it('It should delete post BY ID', (done)=> {
      const postId = '60ab1d1a57efb02178a3f596'
      chai.request('http://localhost:3000/api/posts')
          .delete('/'+ postId)
          .end((err, response) =>{
            response.should.have.status(200);
          })
          done();
    })
  })

  /**
   *  Test the post by User Id
   */
   describe('GET /api/posts/my-posts/:userId', () =>{
    it('It should post BY ID', (done)=> {
      const userId = '60ab1d1a57efb02178a3f596'
      chai.request('http://localhost:3000/api/posts')
          .get('/my-posts/'+ userId)
          .end((err, response) =>{
            response.should.have.status(200);
          })
          done();
    })
  })
})



