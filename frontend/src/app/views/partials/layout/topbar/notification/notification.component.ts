// Angular
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { NavigationEnd, Router } from '@angular/router';
import { environment } from '../../../../../../environments/environment';

@Component({
	selector: 'kt-notification',
	templateUrl: './notification.component.html',
	styleUrls: ['notification.component.scss']
})
export class NotificationComponent implements OnInit {

	// Show dot on top of the icon
	@Input() dot: string;

	// Show pulse on icon
	@Input() pulse: boolean;

	@Input() pulseLight: boolean;

	// Set icon class name
	@Input() icon = 'flaticon2-bell-alarm-symbol';
	@Input() iconType: '' | 'success';

	// Set true to icon as SVG or false as icon class
	@Input() useSVG: boolean;

	// Set bg image path
	@Input() bgImage: string;

	// Set skin color, default to light
	@Input() skin: 'light' | 'dark' = 'light';

	notifications;
	total = 0;
	toggle = {
		transaction: false
	};

	/**
	 * Component constructor
	 *
	 * @param sanitizer: DomSanitizer
	 */
	constructor(
		private sanitizer: DomSanitizer,
		private http: HttpClient,
		private router: Router,
		private cdr: ChangeDetectorRef
	) {
	}

	backGroundStyle(): string {
		if (!this.bgImage) {
			return 'none';
		}

		return 'url(' + this.bgImage + ')';
	}

	ngOnInit() {
		// Run events when navigate trigerred
		this.checkNotification();
		this.router.events.subscribe((ev) => {
			if(ev instanceof NavigationEnd) this.checkNotification();
		});
	}

	checkNotification() {
		const url = `${environment.baseAPI}/api/webnotif/list`;
		
		this.http.get<any>(url).subscribe(i => {
			this.total = i.totalCount ? i.totalCount : 0;
			this.notifications = i.data;
		});
	}

	_toggleMenu(key) {
		this.toggle = { ...this.toggle, [key]: !this.toggle[key] };
	}
	_navigate(url, key?) {
		if(key) this.http.patch<any>(`${environment.baseAPI}/api/webnotif/update?type=${key}`, null).subscribe();
		
		this.router.navigate([url]);
	}

	menuClickHandler(key, e?) {
		if(e) e.preventDefault();

		switch(key) {
			case 'ticket':
				this._navigate('/ticket', 'ticket');
				break;
			case 'power':
				this._navigate('/power-management/power/transaction', 'power');
				break;
			case 'water':
				this._navigate('/water-management/water/transaction', 'water');
				break;
			case 'billing':
				this._navigate('/billing');
				break;
		}
	}
}
