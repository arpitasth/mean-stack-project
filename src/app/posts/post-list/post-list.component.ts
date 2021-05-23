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
  private postSubscription!: Subscription;

  constructor(private postService: PostService) { }

  ngOnInit(): void {
    this.isLoading = true;
    this.postService.getPost();
    this.postSubscription = this.postService.getPostUpdateListener()
    .subscribe((posts: Post[]) => {
      this.isLoading = false;
      this.posts = posts;
    })
  }

  onDeletePost(id: string){
    this.postService.deletePost(id);
  }

  ngOnDestroy(){
    this.postSubscription.unsubscribe();
  }


}
