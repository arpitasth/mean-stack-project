const Post = require('../models/Post');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');

/**
 *  @param {Object} req The request Object
 *  @param {Object} res The response Object
 *  @param {function} next The callback to the next program handler
 *  @description: Add the new post
 */
exports.addPost = asyncHandler(async(req, res, next) => {
  // Create the post
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

/**
 *  @param {Object} req The request Object
 *  @param {Object} res The response Object
 *  @param {function} next The callback to the next program handler
 *  @description: Get All the posts
 */
exports.getPosts = asyncHandler(async(req, res, next) => {
  const posts = await Post.find();
    res.status(200).json({
      message: "Posts Send Successfully",
      data: posts
    });
});

/**
 *  @param {Object} req The request Object
 *  @param {Object} res The response Object
 *  @param {function} next The callback to the next program handler
 *  @description: Get post By post Id
 */
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

/**
 *  @param {Object} req The request Object
 *  @param {Object} res The response Object
 *  @param {function} next The callback to the next program handler
 *  @description:  Update the post by id (only the user who has created the post can update the post)
 */
exports.updatePost = asyncHandler(async(req, res, next) => {
  let post = await Post.findById(req.params.id);
    if(!post){
        return  next(new ErrorResponse(`Post not found with id: ${req.params.id}`, 404));
    }
    //Make Sure User is Post owner
    if(post.user.toString() !== req.user.id){
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

/**
 *  @param {Object} req The request Object
 *  @param {Object} res The response Object
 *  @param {function} next The callback to the next program handler
 *  @description: Delete the post by ID (only the user who has created the post can delete the post)
 */
exports.deletePost = asyncHandler(async(req, res, next)=> {
  const post = await Post.findById(req.params.id);
    if(!post){
        return  next(new ErrorResponse(`Post not found with id: ${req.params.id}`, 404));
    }
    // Make Sure User is Post owner
    if(post.user.toString() !== req.user.id ){
        return  next(new ErrorResponse(`User is not authorize to update this post`, 401));
    }
    await post.remove();
    res.status(200).json({
        status: true,
        message: `Post Deleted Successfully!!`
    });
});

/**
 *  @param {Object} req The request Object
 *  @param {Object} res The response Object
 *  @param {function} next The callback to the next program handler
 *  @description: Get the posts by UserId
 */
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

