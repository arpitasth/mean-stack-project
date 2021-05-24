import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { AngularMaterialModule } from './../angular-material.module';
import { CommonModule } from '@angular/common';

import { PostsComponent } from './posts.component';
import { MyPostsComponent } from './my-posts/my-posts.component';
import { PostCreateComponent } from './post-create/post-create.component';
import { PostListComponent } from './post-list/post-list.component';


@NgModule({
  declarations: [
    PostsComponent,
    PostCreateComponent,
    PostListComponent,
    MyPostsComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AngularMaterialModule,
    RouterModule
  ],
  exports: []
})

export class PostModule{}
