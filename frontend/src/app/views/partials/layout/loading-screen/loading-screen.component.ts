import { Component, OnDestroy, OnInit,} from '@angular/core';
import objectPath from 'object-path';
import { Subscription } from 'rxjs';
import { LayoutConfigService } from '../../../../core/_base/layout';
import { LoadingScreenService } from '../../../../core/_base/layout/services/loading-screen.service';

@Component({
  selector: 'kt-loading-screen',
  templateUrl: './loading-screen.component.html',
  styleUrls: ['./loading-screen.component.scss']
})
export class LoadingScreenComponent implements OnInit, OnDestroy {

	loaderLogo: string;
	loaderType: string;
	loading: boolean = false;
	message: string;
	loadingSubscription: Subscription;
	loadingMessage: Subscription;
 
	constructor(
		private layoutConfigService: LayoutConfigService,
		private loadingScreenService: LoadingScreenService) {
	}


  ngOnInit() {
    const loaderConfig = this.layoutConfigService.getConfig('loader');
		this.loaderLogo = objectPath.get(loaderConfig, 'logo');
		this.loaderType = objectPath.get(loaderConfig, 'type');
		this.loadingSubscription = this.loadingScreenService.loadingStatus.subscribe((value) => {
      this.loading = value;
    });
		this.loadingMessage = this.loadingScreenService.loadingMessage.subscribe((value)=>{
			this.message = value
		});
  }

	ngOnDestroy(){
		this.loadingSubscription.unsubscribe();
		this.loadingMessage.unsubscribe();
	}
}
