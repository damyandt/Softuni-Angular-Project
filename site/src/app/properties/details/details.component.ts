import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Property } from 'src/app/types/property';
import { Comment1 } from 'src/app/types/comment';
import { UserService } from 'src/app/user/user.service';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit {

  form = this.fb.group({
    comment12: ['', [Validators.required]],
    name: ['', [Validators.required]],
  });

  property: Property | undefined;
  comments: Comment1[] | undefined;
  commentars: any;
  owner: boolean = false;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private router: Router
  ) { }

  get isLogged(): boolean {
    return this.userService.isLogged;
  }

  ngOnInit(): void {
    this.getProperty();
    this.getAllComments();
  }

  getProperty(): void {
    const id = this.activatedRoute.snapshot.params['propertyId'];
    this.apiService.getProperty(id).subscribe(property => {
      this.property = property;

      if (property == undefined) {
        this.router.navigate(['/error']);
      }

      if (property.userId === (this.userService.user?.email)?.split('@')[0]) {
        this.owner = true;
      }

    })

  }

  getAllComments(): void {
    const id = this.activatedRoute.snapshot.params['propertyId'];
    this.apiService.getComments(id).subscribe(comments => {
      this.comments = comments;
      this.commentars = this.apiService.getArrayValuesComments(comments);
    })
  }

  postComment(): void {
    const { comment12, name } = this.form.value;
    const id = this.activatedRoute.snapshot.params['propertyId'];
    this.apiService.newComment(id, comment12!, name!).subscribe(
      {
        next: () => {
          this.form.setValue({
            comment12: '',
            name: ''
          })
          this.router.navigate([`catalog/${id}`]);
          this.getAllComments();
        },
        error: () => {
          this.router.navigate([`error`]);
        }
      }
    )
  }

  goToEdit(): void {
    const id = this.activatedRoute.snapshot.params['propertyId'];
    this.router.navigate([`catalog/${id}/edit`]);
  }

  delete1(): void {
    const id = this.activatedRoute.snapshot.params['propertyId'];

    this.apiService.deleteProperty(id).subscribe({
      next: () => {
        this.router.navigate([`catalog`]);
      },
      error: () => {
        this.router.navigate([`error`]);
      }
    }
    )
  }
}
