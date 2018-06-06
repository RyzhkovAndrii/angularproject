import {
  Component,
  OnInit,
  ViewContainerRef
} from '@angular/core';
import {
  ModalDialogService
} from 'ngx-modal-dialog';
import {
  AppModalService
} from '../../../app-shared/services/app-modal.service';

import {
  StandardsService
} from '../../services/standards.service';

@Component({
  selector: 'app-standards-page',
  templateUrl: './standards-page.component.html',
  styleUrls: ['./standards-page.component.css']
})
export class StandardsPageComponent implements OnInit {
  standards: StandardResponse[];
  productsMap: Map < number,
  ProductTypeResponse > ;
  rollsMap: Map < number,
  RollType > ;

  constructor(
    private standardsService: StandardsService,
    private ngxModalService: ModalDialogService,
    private viewRef: ViewContainerRef,
    private appModalService: AppModalService
  ) {}

  ngOnInit() {
    this.fetchData();
  }


  fetchData() {
    this.standardsService.getStandardsInfo()
      .subscribe(info => {
        this.standards = info.standardResponses;
        this.productsMap = info.productTypes;
        this.rollsMap = info.rollTypes;
        console.log(info);
      }, error => this.appModalService.openHttpErrorModal(this.ngxModalService, this.viewRef, error));
  }
}
