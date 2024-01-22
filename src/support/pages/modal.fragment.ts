export class ModalFragment {
    modalBody = ('ngb-modal-window:not([aria-hidden])');
    h1 = this.modalBody + (' h1');
    h2 = this.modalBody + (' h2');
    h3 = this.modalBody + (' h3');
    input = this.modalBody + (' input');
    btnsGroup = this.modalBody + (' .buttons-group');
    cancelBtn = this.modalBody + (' .decline-btn');
    submitBtn = this.modalBody + (' .submit-btn');
    errorMessage = this.modalBody + (' .form-control-error');
    buttons = this.modalBody + (' button');

    errorModal = ('app-ok-modal');
    errorModalH1 = this.errorModal + (' h1');
    premiumPopup = ('premium-feature-modal');
    premiumPopupContactUsBtn = ('.premium-feature_contact-btn');
    premiumPopupNotNowBtn = ('.premium-feature_not-now-btn');
}