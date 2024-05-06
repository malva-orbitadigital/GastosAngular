import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor(private _snackBar: MatSnackBar) { }

  logError(message: string) {
    this._snackBar.open(message, 'Cerrar', {
      duration: 2000,
    });
  }

}
