import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';

import { ForumComponent } from './forum.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { PostService } from './post.service';
import { provideMockStore } from '@ngrx/store/testing';
import { PersonRowClass } from '../admin/admin.service';
import { HttpClient } from '@angular/common/http';
import { dummyPosts } from './testobjects';
import { of } from 'rxjs';
import { FormsModule } from '@angular/forms';
import {
  ActivatedRoute,
  Router,
  RouterModule,
  RouterLinkWithHref,
} from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { findEl, findEls } from 'src/app/spec-helper/element.spec-helper';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MatterComponent } from './matter/matter.component';
import { By } from '@angular/platform-browser';

const initialState = {
  individual: {
    actualUser: {
      _id: 'testUserId',
      adminOf: ['lineage1'],
    },
  },
  admin: {
    members: [
      new PersonRowClass(
        'id1',
        'Emmanuel',
        'Egbebuike',
        'mother_id_1',
        'father_id_1',
        'wife_id_1',
        'husband_id_1',
        [1234],
        'active'
      ),
      new PersonRowClass(
        'personId1',
        'Judy',
        'Smith',
        'mother_id_2',
        'father_id_2',
        'wife_id_2',
        'husband_id_2',
        [1234],
        'active'
      ),
    ],
  },
};

describe('ForumComponent', () => {
  let component: ForumComponent;
  let fixture: ComponentFixture<ForumComponent>;
  let httpClient: HttpClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ForumComponent],
      imports: [
        HttpClientTestingModule,
        FormsModule,
        RouterTestingModule.withRoutes([
          {
            path: ':id',
            component: MatterComponent,
          },
        ]),
      ],
      providers: [PostService, provideMockStore({ initialState }), Router],
      schemas: [NO_ERRORS_SCHEMA],
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ForumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    httpClient = TestBed.inject(HttpClient);

    jest
      .spyOn(httpClient, 'get')
      .mockReturnValue(of({ data: { data: dummyPosts } }));
    component.ngOnInit();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should fetch posts when initialized', async () => {
    expect(httpClient.get).toHaveBeenCalled();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(component.allPosts).toEqual(dummyPosts);
    expect(component.allPosts.length).toBe(5);
  });
  it('should have the first post ', () => {
    let firstPost = findEl(fixture, 'post-0');
    expect(firstPost).toBeDefined();
    expect(firstPost.nativeElement.textContent).toContain('Post Title 1');
    expect(firstPost.nativeElement.textContent).toContain('User 1');
  });
  it('should route to the post when clicked', fakeAsync(() => {
    let firstPost = findEl(fixture, 'post-0');
    const routerLinkInstance = firstPost.injector.get(RouterLinkWithHref);
    expect(routerLinkInstance['commands']).toEqual(['1']);

    // another way
    const router = TestBed.inject(Router);
    firstPost.nativeElement.click();
    tick();
    expect(router.url).toBe(`/1`);
  }));

  it('should filter the created for me', () => {
    findEl(fixture, 'createdForMe').nativeElement.click();
    fixture.detectChanges();
    let forum_topics = fixture.debugElement.queryAll(By.css('.forum-topic'));
    expect(forum_topics.length).toBe(1);
  });
  it('should filter the created by me', () => {
    findEl(fixture, 'createdByMe').nativeElement.click();
    fixture.detectChanges();
    let forum_topics = fixture.debugElement.queryAll(By.css('.forum-topic'));
    expect(forum_topics.length).toBe(2);
  });
  it('should filter the created for', () => {
    const createdForEl = findEl(fixture, 'createdFor').nativeElement;
    createdForEl.value = 'personId1';
    createdForEl.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    let forum_topics = fixture.debugElement.queryAll(By.css('.forum-topic'));
    expect(forum_topics.length).toBe(2);
  });
});
