import {
  AngularFireStorage,
  AngularFireUploadTask,
} from '@angular/fire/storage';
import { Component, Inject, OnInit } from '@angular/core';
import { FileSystemFileEntry, NgxFileDropEntry } from 'ngx-file-drop';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Observable, Subject, combineLatest } from 'rxjs';
import { distinctUntilKeyChanged, filter, switchMap } from 'rxjs/operators';

import { AngularFireAuth } from '@angular/fire/auth';
import { UserMedia } from 'types/user';
import { UserService } from '../components/user/user.service';
import { ulid } from 'ulid';

@Component({
  selector: 'framesystem-image-select',
  template: ` <p>image-select works!</p> `,
  styles: [],
})
export class ImageSelectComponent implements OnInit {
  userMedia: Observable<UserMedia[]>;
  uploadSubject = new Subject<AngularFireUploadTask>();
  uploadProgress = this.uploadSubject
    .asObservable()
    .pipe(switchMap((task) => task.percentageChanges()));
  dropFile: NgxFileDropEntry;

  constructor(
    public matDialogRef: MatDialogRef<ImageSelectComponent, string>,
    private userService: UserService,
    private storage: AngularFireStorage,
    private authService: AngularFireAuth
  ) {}

  ngOnInit(): void {
    this.userMedia = this.authService.user.pipe(
      switchMap(({ uid }) =>
        this.userService.listMedia({ type: 'user', userId: uid })
      )
    );
    combineLatest([
      this.uploadSubject.asObservable(),
      this.authService.user,
    ]).pipe(
      distinctUntilKeyChanged(0),
      filter(([, { uid }]) => !!uid && uid.length > 0)
    );
  }

  ok() {
    this.matDialogRef.close('foo');
  }

  dropped([file]: NgxFileDropEntry[], uid: string) {
    if (file?.fileEntry?.isFile) {
      (file.fileEntry as FileSystemFileEntry).file((file) =>
        this.initiateUpload(file)
      );
    }
  }

  async initiateUpload(file: File) {
    const id = ulid();
    const ref = this.storage.ref(id);
    this.uploadSubject.next(ref.put(file));
  }

  upload(event) {
    console.log(event);
    this.initiateUpload(event.target.files[0]);
  }
}
