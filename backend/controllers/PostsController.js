const Post = require('../models/Post');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');

exports.addPost = asyncHandler(async(req, res, next) => {

    const post = new Post({
      title: req.body.title,
      content: req.body.content,
      imageUrl: req.body.imageUrl,
      user: req.user.id
    });
    await post.save()

    res.status(200).json({
      status: true,
      message: "Post created successfully!!",
    });
});

exports.getPosts = asyncHandler(async(req, res, next) => {

  const posts = await Post.find();

    res.status(200).json({
      message: "Posts Send Successfully",
      data: posts
    });
});

exports.getPostById = asyncHandler(async(req, res, next) => {

  const post = await Post.findById({_id: req.params.id})
  if(!post){
    return  next(new ErrorResponse(`Post not found with id: ${req.params.id}`, 404));
  }

  res.status(200).json({
    status: true,
    data: post,
  });

});

exports.updatePost = asyncHandler(async(req, res, next) => {

  let post = await Post.findById(req.params.id);

    if(!post){
        return  next(new ErrorResponse(`Post not found with id: ${req.params.id}`, 404));
    }

    //Make Sure User is Post owner
    if(post.user.toString() !== req.user.id && req.user.role !== 'admin'){
        return  next(new ErrorResponse(`User is not authorize to update this post`, 401));
    }

    post = await Post.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        success: true,
        message: 'Post Updated Successfully',
        data: post
    })

});

exports.deletePost = asyncHandler(async(req, res, next)=> {
  const post = await Post.findById(req.params.id);
    if(!post){
        return  next(new ErrorResponse(`Post not found with id: ${req.params.id}`, 404));
    }

    // Make Sure User is Post owner
    if(post.user.toString() !== req.user.id && req.user.role !== 'admin'){
        return  next(new ErrorResponse(`User is not authorize to update this post`, 401));
    }

    await post.remove();

    res.status(200).json({
        status: true,
        message: `Post Deleted Successfully!!`
    });
});

exports.getPostsByUser = asyncHandler(async(req, res, next)=> {

  const post = await Post.find({user:req.params.id});

    if(!post){
        return  next(new ErrorResponse(`Post not found with this user id: ${req.user.id}`, 404));
    }

    res.status(200).json({
        status: true,
        data: post,
        message: `Post Fetched Successfully!!`
    });
});

