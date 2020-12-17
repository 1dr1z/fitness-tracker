import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs/Subscription';
import { Exercise } from '../exercise.model';
import * as fromTraining from '../training.reducer';
import { TrainingService } from '../training.service';
@Component({
  selector: 'app-past-trainings',
  templateUrl: './past-trainings.component.html',
  styleUrls: ['./past-trainings.component.css']
})
export class PastTrainingsComponent
  implements OnInit, AfterViewInit, OnDestroy {
  displayedColumns = ['date', 'name', 'duration', 'calories', 'state'];
  dataSource = new MatTableDataSource<Exercise>();
  private exChangedSubscription: Subscription;

  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

  constructor(
    private trainingService: TrainingService,
    private store: Store<fromTraining.State>
  ) {}

  ngOnInit() {
    this.store
      .select(fromTraining.getFinishedExercises)
      .subscribe((exercises: Exercise[]) => {
        this.dataSource.data = exercises;
        console.log(exercises);
      });
    this.trainingService.fetchCompletedOrCancelledExercises();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  doFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  ngOnDestroy() {
    if (this.exChangedSubscription) {
      this.exChangedSubscription.unsubscribe();
    }
  }
}
