import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable,of, throwError } from 'rxjs';
import { shareReplay,map,delay, materialize, dematerialize } from 'rxjs/operators';
import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http';

import { environment } from '../environments/environment';
import { User } from '../_models';
import { UserBudget } from '../_models/userBudget';

@Injectable({ providedIn: 'root' })
export class AccountService {
  users ;
    private userSubject: BehaviorSubject<User>;
    public user: Observable<User>;

    constructor(
        private router: Router,
        private http: HttpClient
    ) {
        //  this.userSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('user')));
        // this.user = this.userSubject.asObservable();
    }

    public get userValue(): User {
        return this.userSubject.value;
    }

    login(username, password) {

      return this.http.post<any>(`http://localhost:3000/login`, { username, password });
  //    this.getUserData().subscribe(d=> {
  //     this.users= d;
  //     console.log("****************users",this.users);
  //     const user = this.users.find(x => x.username === username && x.password === password);
  //     console.log("*********** const user",user);
  //     if (!user) return this.error('Username or password is incorrect');

  //   })
  //   return this.ok({
  //     ...this.basicDetails(user),
  //     token: 'fake-jwt-token'
  // })
  //  .pipe(map(user => {
  //               // store user details and jwt token in local storage to keep user logged in between page refreshes
  //               localStorage.setItem('user', JSON.stringify(user));
  //               this.userSubject.next(user);
  //               return user;
  //           }));



    }
    basicDetails(user) {
      const { id, username, firstName, lastName } = user;
      return { id, username, firstName, lastName };
  }


    logout() {
      console.log("*********** entered logout button")
        // remove user from local storage and set current user to null
        localStorage.removeItem('user');
        // this.userSubject.next(null);
        this.router.navigate(['/login']);
    }

    register(user: User) {
      console.log("************* entered register method")
      // this.getUserData().subscribe(d=> {
      //   this.users= d;
      //   console.log("users data we get",user);
      //   console.log("**********users data available",this.users);
      //   if (this.users.find(x => x.username === user.username)) {
      //     console.log("!!!!!!!!!!!!!!!!!!! matched");
      //     return this.error('Username "' + user.username + '" is already taken')
      //   }
      //   //user.id = this.users.length ? Math.max(...this.users.map(x => x.id)) + 1 : 1;
      //  })
      // // this.putUserData(user);
      // // return this.ok();
      // console.log("%%%%%%%%%%%%%%%%%%%%%%%   user details to be inserted in db",user);
      const token = localStorage.getItem('jwt');
      return this.http.post(`http://localhost:3000/register`, user,{
        headers: {
          'Authorization': `Bearer ${token}`
      }});

    }

    add(userbudget:UserBudget,username: string){
      userbudget.username=username;
      console.log("********* entered add method",userbudget)
      const token = localStorage.getItem('jwt');

      return this.http.post(`http://localhost:3000/add`, userbudget,{
      headers: {
        'Authorization': `Bearer ${token}`
    }}
      );

    }

   ok(body?) {
      return of(new HttpResponse({ status: 200, body }))
          .pipe(delay(500)); // delay observable to simulate server api call
  }

  error(message) {
      return throwError({ error: { message } })
          .pipe(materialize(), delay(500), dematerialize()); // call materialize and dematerialize to ensure delay even if an error is thrown (https://github.com/Reactive-Extensions/RxJS/issues/648);
  }
    // getUserData(): Observable<any> {
    //   const token = localStorage.getItem('jwt');
    //   // this.users = this.http.get('http://localhost:3000/user').pipe(shareReplay());
    //     return this.http.get('http://localhost:3000/user',{
    //       headers: {
    //         'Authorization': `Bearer ${token}`
    //     }});
    // }

    // putUserData(user: any){
    //   const token = localStorage.getItem('jwt');
    //   console.log("^^^^^^^^^^^^^^user data putting into mongo db",user);
    //   return this.http.post<any>(`http://localhost:3000/user`,user,{
    //     headers: {
    //       'Authorization': `Bearer ${token}`
    //   }});
    // }


    getAll(username:string) {
      const token = localStorage.getItem('jwt');
      console.log("********** entered getall method",username)
        return this.http.post<UserBudget[]>(`http://localhost:3000/getbudgetwithuser`,{username},{
          headers: {
            'Authorization': `Bearer ${token}`
        }});
    }


    getById(id: String) {
      const token = localStorage.getItem('jwt');
      console.log("************ entered getbyid",id);
        return this.http.post<UserBudget>(`http://localhost:3000/getbudgetwithid`,{id},{
          headers: {
            'Authorization': `Bearer ${token}`
        }});
    }

    update(id, params,username) {
      const token = localStorage.getItem('jwt');
      params.username = username;
        return this.http.put(`http://localhost:3000/update`, {id,params},{
          headers: {
            'Authorization': `Bearer ${token}`
        }})
    }

    delete(id: String) {
      const token = localStorage.getItem('jwt');
      console.log("*********** enteres delete method")
        return this.http.delete(`http://localhost:3000/delete/${id}`,{
          headers: {
            'Authorization': `Bearer ${token}`
        }});
    }
}
