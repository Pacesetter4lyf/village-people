import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { DiscussionEditComponent } from './discussion-edit.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { PostService } from '../post.service';
import { PersonRowClass } from '../../admin/admin.service';
import { HttpClient } from '@angular/common/http';
import { dummyPosts } from '../testobjects';
import { FormsModule } from '@angular/forms';

class MockActivatedRoute {
  // You can customize this to match your test requirements
  params = of({ id: '1' });
}
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

describe('DiscussionEditComponent', () => {
  let component: DiscussionEditComponent;
  let fixture: ComponentFixture<DiscussionEditComponent>;
  let httpClient: HttpClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DiscussionEditComponent],
      imports: [FormsModule, HttpClientTestingModule, RouterTestingModule],
      providers: [
        PostService,
        Router,
        { provide: ActivatedRoute, useClass: MockActivatedRoute },
        provideMockStore({ initialState }),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    httpClient = TestBed.inject(HttpClient);
    jest
      .spyOn(httpClient, 'get')
      .mockReturnValue(of({ data: { data: dummyPosts[0] } }));

    fixture = TestBed.createComponent(DiscussionEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
