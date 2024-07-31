// Angular
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
// Partials
import { PartialsModule } from '../partials/partials.module';
// Pages
import { CoreModule } from '../../core/core.module';
import { UserManagementModule } from './user-management/user-management.module';
import { MyPageComponent } from './my-page/my-page.component';
import {BlockGroupModule} from './blockgroup/block-group.module';
import {BlockModule} from './block/block.module';
import {BuildingModule} from './building/building.module';
import { FloorModule } from './floor/floor.module';
import { UnitModule } from './unit/unit.module';
import { PowerModule } from './power/power.module';
import { WaterModule } from './water/water.module';
import { GasModule } from './gas/gas.module';
import { CustomerModule } from './customer/customer.module';
import { VehicletypeModule } from './vehicletype/vehicletype.module';
import {FrontdeskModule} from './frontdesk/frontdesk.module';
import {UnitTypeModule} from './unittype/unittype.module';
import {DataTransferModule} from './datatransfer/datatransfer.module';
import {ImportModule} from './import/import.module';
import {FileSelectDirective} from 'ng2-file-upload';
import { BillingModule } from './billing/billing.module';
import { UnitRateModule } from './unitrate/unitrate.module';
import { DepositModule } from './deposit/deposit.module';
import { GlModule } from './finance/gl/gl.module';



@NgModule({
	declarations: [MyPageComponent],
	exports: [],
	imports: [
		CommonModule,
		HttpClientModule,
		FormsModule,
		CoreModule,
		PartialsModule,
		UserManagementModule,
		BlockGroupModule,
		BlockModule,
		BuildingModule,
		FloorModule,
		UnitModule,
		PowerModule,
		WaterModule,
		CustomerModule,
		VehicletypeModule,
		FrontdeskModule,
		UnitTypeModule,
		DataTransferModule,
		ImportModule,
		UnitRateModule,
		GasModule,
		BillingModule,
		DepositModule,
		GlModule
	],
	providers: []
})
export class PagesModule {
}
