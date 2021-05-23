const Post = require('../models/post');

exports.addProduct = (req, res, next) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
  });
  return post.save()
  .then(response => {
    console.log(response);
    res.status(200).json({
      message: 'Post Created Successfully!!',
      postId: response._id
    });
  }).catch(error => {
    console.log(error);
  });
}

exports.getProducts = (req, res, next) => {
  Post.find()
  .then(data => {
    res.status(200).json({
      message: "Posts Send Successfully",
      posts: data
    });
  })
  .catch(err => {
    console.log(err);
  });
}

exports.getProductById =  (req, res, next) => {
  Post.findById({_id: req.params.id})
  .then(data => {
    console.log(data);
    if(data){
      res.status(200).json(data);
    } else {
      res.status(200).json({
        message: "Data Fetched successfully"
      })
    }
  }).catch(err => {
    console.log(err);
  });
}

exports.getUpdate =  (req, res, next) => {
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content
  });
  Post.updateOne({ _id: req.params.postId}, post)
  .then(data => {
    console.log(data);
    res.status(200).json({
      message: "Update Successful!"
    });
  }).catch(error => {
    console.log(error);
  })
}

exports.getDelete = (req, res, next)=> {
  const postId = req.params.postId;
  Post.deleteOne({ _id: postId})
  .then(post => {
    res.status(200).json({
      message: "Post Deleted Successfully",
    });
  })
  .catch(err => {
    console.log(err);
  });
};

