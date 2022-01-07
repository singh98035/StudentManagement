import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormControl } from '@angular/forms';
import { collection, doc, getDocs, query, setDoc, Timestamp, updateDoc, where, onSnapshot } from 'firebase/firestore';
import { DbService } from '../services/db.service';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  studentForm: FormGroup;
  studentUpdateBool: boolean = false;
  studentsList: any[] = [];
  tempStdList: any[] = [];

  constructor(
    private modalService: NgbModal,
    public db: DbService
  ) { }

  ngOnInit(): void {
    let collectionRef = collection(this.db.firestore, 'students');
    let queryRef = query(collectionRef, where('active', '==', true))
    onSnapshot(queryRef, (res) => {
      this.studentsList = res.docs.map(e => ({ ...e.data() }));
      this.tempStdList = [...this.studentsList];
    })
  }

  openStudentModal(modalRef: any, studentObj: any | null = null) {
    this.modalService.open(modalRef, {
      size: 'lg'
    })

    if (studentObj === null) {
      this.studentUpdateBool = false;
      this.studentForm = new FormGroup({
        studentId: new FormControl(''),
        name: new FormControl(''),
        fatherName: new FormControl(''),
        motherName: new FormControl(''),
        age: new FormControl(''),
        homeAddress: new FormGroup({
          address: new FormControl(''),
          city: new FormControl(''),
          state: new FormControl(''),
          country: new FormControl('')
        }),
        registrationDate: new FormControl(Timestamp.now()),
        active: new FormControl(true)
      });
    } else {
      this.studentUpdateBool = true;
      this.studentForm = new FormGroup({
        studentId: new FormControl(studentObj.studentId),
        name: new FormControl(studentObj.name),
        fatherName: new FormControl(studentObj.fatherName),
        motherName: new FormControl(studentObj.motherName),
        age: new FormControl(studentObj.age),
        homeAddress: new FormGroup({
          address: new FormControl(studentObj.homeAddress.address || ''),
          city: new FormControl(studentObj.homeAddress.city || ''),
          state: new FormControl(studentObj.homeAddress.state || ''),
          country: new FormControl(studentObj.homeAddress.country || '')
        }),
        registrationDate: new FormControl(studentObj.registrationDate),
        active: new FormControl(studentObj.active || true)
      });
    }
  }

  submitForm() {
    let values = { ...this.studentForm?.value };
    
    values.studentId = values.studentId !== '' ? values.studentId : String(values.name)
      .trim()
      .toLowerCase()
      .replace(/ /g, "_")
      .concat("_", formatDate(values.registrationDate.toDate(), 'yyyyMMddhhmmss', 'en-us'));
    
    let docRef = doc(this.db.firestore, `students/${values.studentId}`);
    setDoc(docRef, { ...values }, { merge: true })
      .then((value) => {
        console.log("Added Successfully");
        console.log(value);
        this.modalService.dismissAll();
      }, (error) => {
        console.log("Somthing Went Wrong!!");
        console.log(error);
      })
  }

  filterData(event: any) {
    let value = String(event.target.value).toLowerCase();   
    if(value === '') {
      this.studentsList = [...this.tempStdList]
    } else {
      this.studentsList = this.tempStdList.filter((x: any, index: number) => 
        String(x.name).toLowerCase().includes(value) ||
        String(x.homeAddress.city).toLowerCase().includes(value)
      )
    }
  }

  deleteStudentRecord(studentId: any) {
    let docRef = doc(this.db.firestore, `students/${studentId}`);
    updateDoc(docRef, {
      active: false
    }).then(() => {
      console.log("Std Record Deleted Successfully");
    }, (error) => {
      console.log(error);
    })
  }
}
