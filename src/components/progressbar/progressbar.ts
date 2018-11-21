import { Component, Input } from '@angular/core';

@Component({
	selector: 'progressbar',
	templateUrl: 'progressbar.html'
})
export class ProgressBarComponent {
	@Input('progress') progress;
	
	constructor() {
	}
}