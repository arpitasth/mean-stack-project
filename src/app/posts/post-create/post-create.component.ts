import { Component, OnInit } from '@angular/core';
import { PostService } from './../../services/posts.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Params } from '@angular/router';
import { Post } from 'src/app/models/posts.model';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {

  /**
   *  Intializing the variables
   */
  enteredTitle = '';
  enteredContent = '';
  isLoading = false;
  form!: FormGroup;
  mode = 'create';
  private postId: any;
  post: any;

  // Injecting the services to the constructor
  constructor(private postService: PostService, private route: ActivatedRoute, private fb: FormBuilder) { }

  ngOnInit(): void {
    // Initilizing the form
    this.initializeForm();
    // Getting the parameters values
    this.route.paramMap.subscribe((params: ParamMap) => {
      if(params.has('postId')){
        this.mode = 'edit';
        this.postId = params.get('postId');
        this.isLoading = true;
        this.postService.getPostById(this.postId).subscribe((postData: any) => {
          const data = postData.data;
          this.isLoading = false;
          this.post = {
            id: data._id,
            title: data.title,
            content: data.content,
            imageUrl: data.imageUrl,
            user: data.user
          }

          // Setting the values in reactive form for edit method
          this.form.setValue({
            title: this.post.title,
            content: this.post.content,
            imageUrl: this.post.imageUrl
          })
        });
      } else {
        this.mode = 'create';
        this.postId = null;
      }
    })
  }

  /**
   *  Initilizing the form controls
   */
  initializeForm() {
    this.form = this.fb.group({
      'title': new FormControl('', {validators: [Validators.required]}),
      'content': new FormControl('', {validators: [Validators.required]}),
      'imageUrl': new FormControl('', {validators: [Validators.required]}),
    });
  }

  /**
   * Saving the posts
   */
  onSavePost(){
    if(this.form.invalid){
      return ;
    }
    this.isLoading = true;
    if(this.mode === 'create'){
      this.postService.addPost(this.form.value.title, this.form.value.content, this.form.value.imageUrl);
    } else {
      this.postService.updatePost(this.postId, this.form.value.title, this.form.value.content, this.form.value.imageUrl);
    }
    this.form.reset();
  }
}
