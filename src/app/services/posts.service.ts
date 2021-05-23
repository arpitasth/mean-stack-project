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

  constructor(private http: HttpClient, private router: Router){}

  getPost() {
    this.http.get<{message: string, posts: any}>(
      'http://localhost:3000/api/posts'
      ).pipe(map(postData => {
        return postData.posts.map((post: any) => {
          return {
            title: post.title,
            content: post.content,
            id: post._id
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
      'http://localhost:3000/api/posts/'+id
    );
  }

  addPost(title:string, content:string){
    const post: Post = {id: '', title: title, content: content};
    this.http
    .post<{message: string, postId: string}>('http://localhost:3000/api/posts', post)
    .subscribe( responseData => {
      const id = responseData.postId;
      post.id = id;
      this.posts.push(post);
      this.postUpdated.next([...this.posts]);
      this.router.navigate(['/']);
    });
  }

  updatePost(id: string, title: string, content: string){
    const post: Post = {id: id, title: title, content: content};
    this.http.put('http://localhost:3000/api/posts/'+id, post)
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
    this.http.delete('http://localhost:3000/api/posts/' + postId)
    .subscribe(res => {
      if(res){
        const updatedPosts = this.posts.filter(post =>{
          return post.id !== postId
        });
        this.posts = updatedPosts;
        this.postUpdated.next([...this.posts]);
      }
    })
  }

}
