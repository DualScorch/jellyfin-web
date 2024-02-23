import {TourGuideClient} from '../Tour';

async function handleClose(this: TourGuideClient) {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve, reject) => {
        if (this._promiseWaiting) return reject('Promise waiting');
        this._promiseWaiting = true;
        // After change callback - global

        if (this._globalBeforeExitCallback) try {
            await this._globalBeforeExitCallback();
        } catch (e) {
            return reject(e);
        }

        this.dialog.style.animation = 'scaledown 140ms ease-in-out normal both';
        this.backdrop.style.animation = 'fadeout 140ms ease-in-out normal both';
        this.dialog.addEventListener('animationend', async () => {
            this.dialog.style.display = 'none';
            this.isVisible = false;
            this.backdrop.style.display = 'none';

            if (!this.options.rememberStep) this.activeStep = 0;

            if (this.options.debug) console.info('Tour exited');

            await this.destroyListeners();

            setTimeout(() => {
                if (this._globalAfterExitCallback) this._globalAfterExitCallback();
            }, 0);

            this._promiseWaiting = false;

            this.dialog.removeEventListener('animationend', () => '');

            return resolve(true);
        });

        const dialogContainer = document.querySelector('.unique-dialog-container');
        if (dialogContainer) dialogContainer.remove();

        const backdrop = document.querySelector('.dialogBackdrop');
        if (backdrop) {
            backdrop.classList.remove('dialogBackdropOpened');
            setTimeout(() => {
                backdrop.remove();
            }, 300);
        }
    });
}

export default handleClose;
