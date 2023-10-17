import { TestBed, inject } from '@angular/core/testing';

import { PostService } from './post.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { provideMockStore } from '@ngrx/store/testing';

describe('PostService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PostService, provideMockStore()],
      imports: [HttpClientTestingModule],
    });
  });

  it('should be created', inject([PostService], (service: PostService) => {
    expect(service).toBeTruthy();
  }));
});
