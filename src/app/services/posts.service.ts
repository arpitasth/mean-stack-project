import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Post } from '../models/posts.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  posts: Post[] = [];
  private postUpdated = new Subject<Post[]>();

  baseurl = "http://localhost:3000/api/posts"

  constructor(private http: HttpClient, private router: Router){}

  getPost() {
    this.http.get<{message: string, data: any}>(
      `${this.baseurl}`
      ).pipe(map(postData => {
        return postData.data.map((post: any) => {
          return {
            title: post.title,
            content: post.content,
            id: post._id,
            imageUrl: post.imageUrl,
            user: post.user
          }
        });
      }))
      .subscribe((data) => {
        this.posts = data;
        this.postUpdated.next([...this.posts]);
      });
  }

  getPostUpdateListener(){
    return this.postUpdated.asObservable();
  }

  getPostById(id: string){
    return this.http.get<{_id:string, title:string, content: string }>(
      `${this.baseurl}/`+id
    );
  }

  getPostByUserId(userId: string){
    return this.http.get<{_id:string, title:string, content: string }>(
       `${this.baseurl}/my-posts/`+userId
    );
  }

  addPost(title:string, content:string, image:string){
    const post: Post = {id: '', title: title, content: content, imageUrl: image};
    this.http
    .post<{message: string, postId: string}>(`${this.baseurl}/posts`, post)
    .subscribe( responseData => {
      const id = responseData.postId;
      post.id = id;
      this.posts.push(post);
      this.postUpdated.next([...this.posts]);
      this.router.navigate(['/']);
    });
  }

  updatePost(id: string, title: string, content: string, image:string){
    const post: Post = {id: id, title: title, content: content, imageUrl: image};
    this.http.put(`${this.baseurl}/`+id, post)
    .subscribe( response => {
      const updatedPosts = [...this.posts];
      const findUpdatedIndex = updatedPosts.findIndex(p => p.id === id);
      updatedPosts[findUpdatedIndex] = post;
      this.posts = updatedPosts;
      this.postUpdated.next([...this.posts]);
      this.router.navigate(['/']);
    })
  }

  deletePost(postId: string){
    this.http.delete(`${this.baseurl}/` + postId)
    .subscribe(res => {
      if(res){
        const updatedPosts = this.posts.filter(post =>{
          return post.id !== postId
        });
        this.posts = updatedPosts;
        this.postUpdated.next([...this.posts]);
        this.router.navigate(['/']);
      }
    })
  }

}
