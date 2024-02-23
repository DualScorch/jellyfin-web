import TabbedView from '../components/tabbedview/tabbedview';
import globalize from '../scripts/globalize';
import '../elements/emby-tabs/emby-tabs';
import '../elements/emby-button/emby-button';
import '../elements/emby-scroller/emby-scroller';
import { appRouter } from '../components/appRouter';
import { TourGuideClient } from '../tourguide/Tour.ts';
import '../tourguide/scss/tour.scss';
import layoutManager from '../components/layoutManager';

const runTour = () => {
    const tourCompleted = localStorage.getItem('tourCompleted');
    const hostname = window.location.hostname;

    if (tourCompleted === 'true' || hostname !== 'jellyfin.nu' || layoutManager.tv === true) {
        return;
    }

    const tour = new TourGuideClient({
        closeButton: false,
        backdropClass: 'dialogContainer',
        exitOnClickOutside: false,
        exitOnEscape: false,
        nextLabel: 'Next →',
        prevLabel: '← Back'

    });

    tour.addSteps([
        {
            title: 'Welcome to Jellyfin 🎉📺',
            content: 'This is the home screen. You can access movies and TV shows from here.'
        },
        {
            title: 'Invites ✉️🔗',
            content: 'Copy your personal invite link to share with friends.',
            target: document.querySelector('#inviteCard')
        },
        {
            title: 'Jellyseerr 🎬📺🔍',
            content: 'Movie or TV show not on Jellyfin? <br><br> Request them on Jellyseerr using this button.',
            target: document.querySelector('#jellyseerrCard')
        },
        {
            title: 'Watch with friends 👫🍿',
            content: 'Click the \'SyncPlay\' button to watch synchronized with friends.',
            target: document.querySelector('.syncButton')
        },
        {
            title: 'All done! ✅🏁',
            content: 'The tour is complete. <br><br> Enjoy using Jellyfin!'
        }
    ]);

    tour.start();
    tour.onAfterExit(() => {
        localStorage.setItem('tourCompleted', 'true');
    });
};
class HomeView extends TabbedView {
    constructor(view, params) {
        super(view, params);
    }

    setTitle() {
        appRouter.setTitle(null);
    }

    onPause() {
        super.onPause(this);
        document.querySelector('.skinHeader').classList.remove('noHomeButtonHeader');
    }

    onResume(options) {
        super.onResume(this, options);
        document.querySelector('.skinHeader').classList.add('noHomeButtonHeader');
    }

    getDefaultTabIndex() {
        return 0;
    }

    getTabs() {
        return [{
            name: globalize.translate('Home')
        }, {
            name: globalize.translate('Favorites')
        }];
    }

    getTabController(index) {
        if (index == null) {
            throw new Error('index cannot be null');
        }

        let depends = '';

        switch (index) {
            case 0:
                depends = 'hometab';
                break;

            case 1:
                depends = 'favorites';
        }

        setTimeout(() => {
            runTour();
        }, 1500);

        const instance = this;
        return import(/* webpackChunkName: "[request]" */ `../controllers/${depends}`).then(({ default: controllerFactory }) => {
            let controller = instance.tabControllers[index];

            if (!controller) {
                controller = new controllerFactory(instance.view.querySelector(".tabContent[data-index='" + index + "']"), instance.params);
                instance.tabControllers[index] = controller;
            }
            return controller;
        });
    }
}

export default HomeView;
