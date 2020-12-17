import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Subscription } from 'rxjs/Subscription';
import * as fromRoot from '../../app.reducer';
import { Exercise } from '../exercise.model';
import * as fromTraining from '../training.reducer';
import { TrainingService } from '../training.service';

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.css']
})
export class NewTrainingComponent implements OnInit, OnDestroy {
  exercises$: Observable<Exercise[]>;
  exerciseSubscription: Subscription;
  // private loadingSubs: Subscription;
  isLoading$: Observable<boolean>;

  constructor(
    private trainingService: TrainingService,
    // private uiService: UIService,
    private store: Store<fromTraining.State>
  ) {}

  ngOnInit() {
    this.isLoading$ = this.store.select(fromRoot.getIsLoading);
    // this.loadingSubs = this.uiService.loadingStateChanged.subscribe(
    //   isLoading => {
    //     this.isLoading = isLoading;
    //   }
    // );
    // this.exerciseSubscription = this.trainingService.exercisesChanged.subscribe(
    //   exercises => {
    //     this.exercises = exercises;
    //   }
    // );
    this.exercises$ = this.store.select(fromTraining.getAvailableTrainings);
    this.fetchExercises();
  }

  onStartTraining(form: NgForm) {
    this.trainingService.startExercise(form.value.exercise);
  }

  fetchExercises() {
    this.trainingService.fetchAvailableExercises();
  }

  ngOnDestroy() {
    if (this.exerciseSubscription) {
      this.exerciseSubscription.unsubscribe();
    }
    // if (this.loadingSubs) {
    //   this.loadingSubs.unsubscribe();
    // }
  }
}
