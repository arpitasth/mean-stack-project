import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Post } from 'src/app/models/posts.model';
import { AuthService } from 'src/app/services/auth.service';
import { PostService } from 'src/app/services/posts.service';

@Component({
  selector: 'app-my-posts',
  templateUrl: './my-posts.component.html',
  styleUrls: ['./my-posts.component.css']
})
export class MyPostsComponent implements OnInit {

  /**
   *  Intializing the variables & create the subscription
   */
  posts : Post[] = [];
  userId: any;
  isLoading = false;
  isAuthenticated: boolean = false;
  private postSubscription!: Subscription;
  private authListener : Subscription;

  constructor(private postService: PostService, private authService: AuthService) { }

  /**
   *  Getting All the posts.
   *  Getting the user Id.
   *  subscribe the request.
   */
  ngOnInit(): void {
    this.isLoading = true;
    this.postService.getPost();
    this.userId = this.authService.getUserId();
    this.postSubscription = this.postService.getPostByUserId(this.userId)
    .subscribe((posts: any) => {
      this.isLoading = false;
      this.posts = posts.data.length > 0 ? posts.data : [];
    })
    this.isAuthenticated = this.authService.getAuth();
    this.authListener = this.authService.getAuthStatus()
    .subscribe(userAuthenticated => {
      this.isAuthenticated = userAuthenticated;
      this.userId = this.authService.getUserId();
    });
  }

  /**
   * Deleting the post by calling post service
   */
  onDeletePost(id: string){
    this.postService.deletePost(id);
  }

  /**
   * Unsubscribe all the subscriptions
   */
  ngOnDestroy(){
    this.postSubscription.unsubscribe();
    this.authListener.unsubscribe();
  }

}
