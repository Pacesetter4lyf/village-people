import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChatSmallComponent } from './chat.component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { Store, StoreModule } from '@ngrx/store';
import { click, findEl } from 'src/app/spec-helper/element.spec-helper';
import { DebugElement } from '@angular/core';
import { Chat, ChatParent } from './chat.model';
import { By } from '@angular/platform-browser';
import * as ChatActions from './store/chat.actions';

describe('chat components ', () => {
  let component: ChatSmallComponent;
  let fixture: ComponentFixture<ChatSmallComponent>;
  let store: MockStore;
  const initialState = {
    individual: { actualUser: { id: null } },
    chat: {
      chatList: [],
      chats: [],
      expanded: false,
      isInActualChat: false,
      chatRecipientId: null,
      chatRecipientName: null,
      error: null,
    },
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChatSmallComponent],
      providers: [provideMockStore({ initialState })],
    });

    store = TestBed.inject(Store) as MockStore;
    fixture = TestBed.createComponent(ChatSmallComponent);
    component = fixture.componentInstance;
    component.ngOnInit();
    jest.spyOn(store, 'dispatch');
  });

  it('should show chat component if signed in', () => {
    let container;
    try {
      container = findEl(fixture, 'container');
    } catch (error) {
      expect(container).toBe(undefined);
    }
    // should show chatcomponent if signed in
    store.setState({
      ...initialState,
      individual: { actualUser: { id: 'someId' } },
    });
    fixture.detectChanges();
    container = findEl(fixture, 'container');
    expect(container).toBeTruthy();
  });
  it('should not be expanded initially', () => {
    store.setState({
      ...initialState,
      individual: { actualUser: { id: 'someId' } },
    });
    fixture.detectChanges();
    let body: DebugElement;
    try {
      body = findEl(fixture, 'body');
    } catch (e) {
      expect(body).toBe(undefined);
    }
    //click the expand
    findEl(fixture, 'collapse-expand').nativeElement.click();
    expect(store.dispatch).toHaveBeenCalled();
    store.setState({
      individual: { actualUser: { id: 'someId' } },
      chat: { ...initialState.chat, expanded: true },
    });
    fixture.detectChanges();
    body = findEl(fixture, 'body');
    expect(body).toBeTruthy();
  });
  it('should show the chat when expanded', () => {
    store.setState({
      individual: { actualUser: { id: 'someId' } },
      chat: {
        ...initialState.chat,
        expanded: true,
        chatList: [
          new ChatParent(
            'John',
            'Hello This is Emmanuel',
            'Emmanuel',
            Date.now().toString(),
            '1234'
          ),
        ],
      },
    });
    fixture.detectChanges();
    // const chatList = findEl(fixture, 'chat-list');
    const chats = fixture.debugElement.queryAll(By.css('.chat'));
    expect(chats.length).toEqual(1);
    const firstChat = chats[0];
    const pTag = firstChat.query(By.css('div div div p'));
    expect(pTag.nativeElement.textContent).toContain('Emmanuel');
  });
  it('should show a single chat detail when chat is clicked', () => {
    const newState = {
      individual: { actualUser: { id: 'someId' } },
      chat: {
        ...initialState.chat,
        expanded: true,
        chats: [],
        chatList: [
          new ChatParent(
            'John',
            'Hello This is Emmanuel',
            'Emmanuel',
            Date.now().toString(),
            '1234'
          ),
        ],
      },
    };
    store.setState(newState);
    fixture.detectChanges();
    // click the first chat
    const chats = fixture.debugElement.queryAll(By.css('.chat'));
    const firstChat = chats[0];
    firstChat.nativeElement.click();

    expect(store.dispatch).toHaveBeenCalledWith(
      new ChatActions.ConversationOpenInitiated({ id: '1234', name: 'John' })
    );

    store.setState({
      ...newState,
      chat: {
        ...newState.chat,
        isInActualChat: true,
        chatRecipientName: 'John',
        chatRecipientId: '1234',
        chats: [
          new Chat(
            'Emmanuel',
            'John',
            'Hello this is Emmanuel',
            new Date(Date.now()).toString(),
            true
          ),
        ],
      },
    });
    fixture.detectChanges();
    // now see if the chat has been updated on the page
    const chatList = fixture.debugElement.query(By.css('.actual-chats'));
    const nameEl = chatList.query(By.css('.name'));
    expect(nameEl.nativeElement.textContent).toBe('John');
    // the chat messages
    const chatMessages = chatList.query(
      By.css('.chat-items div:first-of-type')
    );
    expect(chatMessages.nativeElement.textContent).toContain('Emmanuel');
    expect(chatMessages.nativeElement.textContent).toContain(
      'Hello this is Emmanuel'
    );
  });


  it(' should send a message if the message is typed in', () => {
    const newState = {
      individual: { actualUser: { id: 'someId' } },
      chat: {
        ...initialState.chat,
        expanded: true,
        isInActualChat: true,
        chatRecipientName: 'John',
        chatRecipientId: '1234',
        chats: [
          new Chat(
            'Emmanuel',
            'John',
            'Hello this is Emmanuel',
            new Date(Date.now()).toString(),
            true
          ),
        ],
        chatList: [
          new ChatParent(
            'John',
            'Hello This is Emmanuel',
            'Emmanuel',
            Date.now().toString(),
            '1234'
          ),
        ],
      },
    };
    store.setState(newState);
    fixture.detectChanges();
    const messageBox = findEl(fixture, 'message-box').nativeElement;
    messageBox.value = 'I feel happy';
    click(fixture, 'send-message');
    expect(store.dispatch).toHaveBeenCalledWith(
      new ChatActions.SendMessage({ to: '1234', message: 'I feel happy' })
    );
  });
});
