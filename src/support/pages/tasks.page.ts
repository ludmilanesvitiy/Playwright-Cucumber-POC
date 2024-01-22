import { BasePage } from './base.page';

export class TasksPage extends BasePage {
    mainComponent = ('.tasks-page_body');
    h1 = ('h1');
    search = ('.table-search');
    selectInput = ('app-select input');

    /*Wizard Selectors*/
    textAcknowledgementWizard = ('task-acknowledgement-step');
    finishWizard = ('app-finish-step');
    fileUploadWizard = ('task-file-upload-step');

    getWizardElements (wizardName: string) {
        let baseComponent: string;
        switch (wizardName) {
            case "Acknowledgment Text":
                baseComponent = this.textAcknowledgementWizard;
                break;

            case "Finish":
                baseComponent = this.finishWizard;
                break;

            case "File Upload":
                baseComponent = this.fileUploadWizard;
                break;
        }
        return {
            wizardComponent: baseComponent,
            richText: baseComponent + (' rich-text-editor .ql-editor'),
            richTextEm: baseComponent + (' em'),
            richTextPre: baseComponent + (' pre'),
            richTextH3: baseComponent + (' h3'),
            textImg: baseComponent + (' img'),
            stepName: baseComponent + (' h2'),
            description: baseComponent + (' .task-step-container_description'),
            stepCounter: baseComponent + (' .label-grey'),
            nextBtn: baseComponent + (' .submit-btn'),
            formFieldAddProductCategoryBtn: baseComponent + (' product-categories-selector .sectors-selector_add-btn'),
            formFieldSelectedProductCategories: baseComponent + (' product-categories-selector .sectors-selector_selected-sectors span')
        }
    }
}