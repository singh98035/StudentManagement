import { Injectable } from '@angular/core';
import { initializeApp , FirebaseApp } from '@firebase/app';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, signOut, Auth, UserCredential } from 'firebase/auth';
import { Timestamp, Firestore, getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DbService {

  app: FirebaseApp = initializeApp(environment.firebaseConfig);
  auth: Auth = getAuth();
  firestore: Firestore = getFirestore();
  userLoggedIn: Boolean = false;

  userCredentials: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor( 
    private router: Router
  ) { 
    console.log("DB - Firebase Initialized");
    this.auth.onAuthStateChanged((value) => {
      if(value) {
        // console.log(">>> User Already Sign in");
        //this.getUserFromFirestore(value.uid);
        this.setUserLogin(true);
        this.router.navigate(['/'])
      } else {
        // console.log(">>> user not sign in");
        this.setUserLogin(false);
      }
    }, (error) => {
      console.log(">>> Error: ", error);
      this.setUserLogin(false)
    });
  }

  setUserLogin(userLoggedIn: Boolean){
    this.userLoggedIn = userLoggedIn;
  }

  getUserLogin(): Boolean{
    return this.userLoggedIn;
  }

  loginUser(values: { email: string, password: string }): Promise<any> {
    return new Promise((resolve, reject) => {
      signInWithEmailAndPassword(this.auth, values.email.trim(), values.password)
        .then((res) => {
          console.log("login success fully");
          console.log(res.user.email);
          
          
          this.router.navigate(['/']);
         // this.getUserFromFirestore(res.user.uid);
          this.setUserLogin(true);
          resolve(res)
        }, (error) => reject(error));
    });
  }


  // registerUser(values: { email: string, password: string }): Promise<any> {
  //   return new Promise((resolve, reject) => {
  //     createUserWithEmailAndPassword(this.auth, values.email, values.password)
  //       .then((res) => {
  //         let userData = {
  //           email: res.user?.email,
  //           profileImage: '',
  //           address: '',
  //           uid: res.user?.uid,
  //           creationTime: Timestamp.now()
  //         }; 

  //         this.setUserLogin(true);
  //         this.saveUserToFirestore(userData);
  //         this.getUserFromFirestore(res.user.uid);
  //         this.router.navigate(['/home']);

  //         resolve({ authRes: res, userModel: userData });
  //       }, (err) => reject(err));
  //   });
  // }

  // saveUserToFirestore(userMobel: any) {
  //   return new Promise((resolve, reject) => {
  //     const docRef = doc(this.firestore, "users", userMobel.uid);
  //     setDoc(docRef, { ...userMobel })
  //       .then((res) => {
  //         localStorage.setItem("userData", JSON.stringify(userMobel));
  //         resolve(res)
  //       }, (err) => reject(err));
  //   });
  // }

  // async getUserFromFirestore(userUid: any) {
  //   const docRef = doc(this.firestore, "users", userUid);
  //   const user = await getDoc(docRef);
  //   this.userCredentials.next(Object.assign({}, user.data()));
  //   console.log(">>> User:  ", user.data());
  // }

  logoutUser(){
    signOut(this.auth).then(() => {
      this.setUserLogin(false);
      this.router.navigate(['/login']);
    })
    .catch((error) => {
      console.log("Can't Sign Out");   
    });
  }
}
