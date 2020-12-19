import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { DashboardsRoutingModule } from './dashboards-routing.module';
import { LayoutComponent } from './layout.component';
import { DashboardComponent } from './dashboard.component';
import { AddEditDataComponent } from './add-edit-data.component';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        DashboardsRoutingModule
    ],
    declarations: [
        LayoutComponent,
        DashboardComponent,
        AddEditDataComponent
    ]
})
export class DashboardsModule { }
