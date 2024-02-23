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
        this.dialog.style.display = 'none';
        this.backdrop.style.display = 'none';
        this.isVisible = false;
        if (!this.options.rememberStep) this.activeStep = 0;

        if (this.options.debug) console.info('Tour exited');

        const dialogContainer = document.querySelector('.unique-dialog-container');
        if (dialogContainer) dialogContainer.remove();

        await this.destroyListeners();

        setTimeout(() => {
            if (this._globalAfterExitCallback) this._globalAfterExitCallback();
        }, 0);

        this._promiseWaiting = false;

        return resolve(true);
    });
}

export default handleClose;
