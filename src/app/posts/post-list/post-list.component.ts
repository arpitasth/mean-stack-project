import { AuthService } from './../../services/auth.service';
import { PostService } from './../../services/posts.service';
import { Component, OnInit, Input } from '@angular/core';
import { Post } from '../../models/posts.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit {

  posts : Post[] = [];
  isLoading = false;
  userId: any;
  isAuthenticated: boolean = false;
  private postSubscription!: Subscription;
  private authListener : Subscription;

  constructor(private postService: PostService, private authService: AuthService) { }

  ngOnInit(): void {
    this.isLoading = true;
    this.postService.getPost();
    this.userId = this.authService.getUserId();
    this.postSubscription = this.postService.getPostUpdateListener()
    .subscribe((posts: Post[]) => {
      console.log(posts)
      this.isLoading = false;
      this.posts = posts;
    })
    this.isAuthenticated = this.authService.getAuth();
    this.authListener = this.authService.getAuthStatus()
    .subscribe(userAuthenticated => {
      this.isAuthenticated = userAuthenticated;
      this.userId = this.authService.getUserId();
    });
  }

  // onDeletePost(id: string){
  //   this.postService.deletePost(id);
  // }

  ngOnDestroy(){
    this.postSubscription.unsubscribe();
    this.authListener.unsubscribe();
  }
}
