import {
  NgModule
} from "@angular/core";
import {
  CommonModule
} from "@angular/common";
import {
  ReactiveFormsModule,
  FormsModule
} from "@angular/forms";
import {
  ColorPickerModule
} from 'ngx-color-picker';
import {
  NgbModule
} from "@ng-bootstrap/ng-bootstrap";
import {
  NgSelectModule
} from "@ng-select/ng-select";
import {
  ContextMenuModule
} from "ngx-contextmenu";
import {
  ModalDialogModule
} from "ngx-modal-dialog";

import {
  RollsPageComponent
} from "./components/rolls-page/rolls-page.component";
import {
  RollTypeModalComponent
} from "./components/roll-type-modal/roll-type-modal.component";
import {
  RollOperationModalComponent
} from "./components/roll-operation-modal/roll-operation-modal.component";
import {
  RollsRouting
} from "./rolls-routing.module";
import {
  RollsService
} from "./services/rolls.service";
import {
  RollsUrlService
} from "./services/rolls-url.service";
import {
  RollCheckComponent
} from './components/roll-check/roll-check.component';
import {
  AppSharedModule
} from "../app-shared/app-shared.module";
import {
  RollOperationsPageComponent
} from './components/roll-operations-page/roll-operations-page.component';

@NgModule({
  declarations: [
    RollsPageComponent,
    RollTypeModalComponent,
    RollOperationModalComponent,
    RollCheckComponent,
    RollOperationsPageComponent
  ],
  imports: [
    CommonModule,
    NgbModule.forRoot(),
    RollsRouting,
    ColorPickerModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    ContextMenuModule.forRoot({
      useBootstrap4: true
    }),
    ModalDialogModule.forRoot(),
    AppSharedModule
  ],
  entryComponents: [
    RollTypeModalComponent,
    RollOperationModalComponent
  ],
  providers: [
    RollsService,
    RollsUrlService
  ]
})

export class RollsModule {}
