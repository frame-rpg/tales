import {
  AngularFireStorage,
  AngularFireUploadTask,
} from '@angular/fire/storage';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import {
  FileSystemFileEntry,
  NgxFileDropEntry,
  NgxFileDropModule,
} from 'ngx-file-drop';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, from } from 'rxjs';
import { map, publishReplay, refCount } from 'rxjs/operators';

import { AngularFireAuth } from '@angular/fire/auth';
import { User } from 'types/user';
import { UserService } from '../user.service';
import { ulid } from 'ulid';

@Component({
  selector: 'framesystem-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss'],
})
export class EditComponent implements OnInit {
  form = new FormGroup({
    name: new FormControl('', [Validators.required]),
    avatar: new FormControl(null, [Validators.required]),
  });

  uploadTask: AngularFireUploadTask;
  uploadProgress: Observable<number>;
  newAvatarUrl: Observable<string>;
  dropFile: NgxFileDropEntry;
  user: Observable<User>;
  name: Observable<String>;
  avatar: Observable<string>;

  constructor(
    private userService: UserService,
    private auth: AngularFireAuth,
    private storage: AngularFireStorage,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.user = this.userService.loggedInData.pipe(
      publishReplay(1),
      refCount()
    );
    this.name = this.user.pipe(map((u) => u.name));
    this.avatar = this.user.pipe(map((u) => u.avatar));
  }

  dropped([file]: NgxFileDropEntry[]) {
    if (file?.fileEntry?.isFile) {
      (file.fileEntry as FileSystemFileEntry).file((file) =>
        this.initiateUpload(file)
      );
    }
  }

  initiateUpload(file: File) {
    const id = ulid();
    const ref = this.storage.ref(id);
    this.uploadTask = ref.put(file);
    this.uploadProgress = this.uploadTask.percentageChanges();
    this.newAvatarUrl = from(
      this.uploadTask.then((v) => v.ref.getDownloadURL())
    );
    this.cdr.detectChanges();
  }

  upload(event) {
    console.log(event);
    this.initiateUpload(event.target.files[0]);
  }
}
