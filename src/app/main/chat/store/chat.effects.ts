import { Actions, ofType, createEffect } from '@ngrx/effects';
import * as AuthActions from './chat.actions';
import { switchMap, map, catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { Chat, ChatParent } from '../chat.model';
import * as ChatActions from './chat.actions';

const apiUrl = environment.apiUrl;

export interface GetChatsI<T> {
  data: {
    data?: T;
  };
  status: string;
}

@Injectable()
export class chatEffects {
  getChatList = createEffect(() =>
    this.actions$.pipe(
      ofType(ChatActions.GET_CHAT_LIST, ChatActions.UPDATE_CURRENT_CHAT),
      switchMap(() => {
        return this.http.get<GetChatsI<ChatParent[]>>(`${apiUrl}/chat/`).pipe(
          map((responseData) => {
            return new ChatActions.LoadChatList({
              chatList: responseData.data.data,
            });
          }),
          catchError((errorRes) => {
            return of(new ChatActions.ErrorGettingList(errorRes as string));
          })
        );
      })
    )
  );
  getActualChat = createEffect(() =>
    this.actions$.pipe(
      ofType(
        ChatActions.GET_ACTUAL_CHAT,
        ChatActions.CONVERSATION_OPEN_INITIATED
      ),
      switchMap((data: ChatActions.GetActualChat) => {
        return this.http
          .get<GetChatsI<Chat[]>>(`${apiUrl}/chat/${data.payload.id}`)
          .pipe(
            map((responseData) => {
              return new AuthActions.LoadActualChat({
                actualChat: responseData.data.data,
              });
            }),
            catchError((errorRes) => {
              return of(
                new ChatActions.ErrorGettingActualChat(errorRes as string)
              );
            })
          );
      })
    )
  );
  sendMessage = createEffect(() =>
    this.actions$.pipe(
      ofType(ChatActions.SEND_MESSAGE),
      switchMap((data: ChatActions.SendMessage) => {
        return this.http
          .post<GetChatsI<Chat>>(`${apiUrl}/chat/`, {
            to: data.payload.to,
            message: data.payload.message,
          })
          .pipe(
            map((responseData) => {
              return new AuthActions.UpdateCurrentChat({
                chat: responseData.data.data,
              });
            }),
            catchError((errorRes) => {
              return of(
                new ChatActions.ErrorSendingMessage(errorRes as string)
              );
            })
          );
      })
    )
  );

  openConversation = createEffect(() => {
    return this.actions$.pipe(
      ofType(ChatActions.GET_ACTUAL_CHAT),
      map((action) => new ChatActions.OpenChatUi())
    );
  });

  constructor(private actions$: Actions, private http: HttpClient) {}
}
