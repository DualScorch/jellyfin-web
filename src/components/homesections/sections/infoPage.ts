import type { BaseItemDto } from "@jellyfin/sdk/lib/generated-client/models/base-item-dto";
import type { ApiClient } from "jellyfin-apiclient";
import toast from "components/toast/toast";

import imageLoader from "components/images/imageLoader";

import Dashboard from "utils/dashboard";
import layoutManager from "components/layoutManager";

function enableScrollX() {
    return true;
}

function getLoadInfoHtml(
    elem: HTMLElement,
    apiClient: ApiClient,
    userViews: BaseItemDto[]
) {
    let html = "";
    if (userViews.length) {
        html +=
            '<h2 class="sectionTitle sectionTitle-cards padded-left">' +
            "Information" +
            "</h2>";
        if (enableScrollX()) {
            html +=
                '<div is="emby-scroller" class="padded-top-focusscale padded-bottom-focusscale" data-centerfocus="true">';
            html +=
                '<div is="emby-itemscontainer" class="itemsContainer scrollSlider focuscontainer-x">';
        } else {
            html +=
                '<div is="emby-itemscontainer" class="itemsContainer focuscontainer-x padded-left padded-right vertical-wrap">';
        }
        html += getNewAdressCard();
        html += getInviteCard(apiClient.getCurrentUserId());
        html += getJellyseerrCard();
        if (enableScrollX()) {
            html += "</div>";
        }
        html += "</div>";
    }
    return html;
}

export function loadInfo(
    elem: HTMLElement,
    apiClient: ApiClient,
    userViews: BaseItemDto[]
) {
    // elem.classList.remove('verticalSection');
    const html = getLoadInfoHtml(elem, apiClient, userViews);
    elem.innerHTML = html;

    const inviteCard = elem.querySelector("#inviteCard");
    if (inviteCard) {
        fetch('https://utils.jellyfin.nu/api/code?userId=' + apiClient.getCurrentUserId()).then(response => response.json()).then(data => {
            if (data.error) {
                return;
            }

            inviteCard.addEventListener('click', () => {
                navigator.clipboard.writeText(
                    `https://${window.location.hostname}/web/#/createaccount.html?code=${data.code}`
                     ).then(() => {
                toast('Copied invite link to clipboard');
                }
            )});


        })
    }
    imageLoader.lazyChildren(elem);
}

const getNewAdressCard = () => {
    if (window.location.hostname === "jelly.jakobtor.casa") {
        return `
        <a href="https://jellyfin.nu/">
        <div class="card overflowBackdropCard card-hoverable card-withuserdata">
            <div class="cardBox cardBox-bottompadded">
                <div class="cardScalable">
                    <div class="cardPadder
                    cardPadder-overflowBackdrop lazy-hidden-children">
                        <button data-action="link" class="cardImageContainer coveredImage cardContent itemAction " aria-label="New Adress" style="background-image: url('https://images.jellyfin.nu/new-address-s.png'); opacity: 1; display: flex; justify-content: center; align-items: center; flex-direction: column; gap: 4px; color: #fff;"></button>
                        <div class="cardOverlayContainer itemAction" data-action="link">
                            <div class="cardOverlayButton-br flex"></div>
                        </div>
                    </div>
                    <div class="cardText cardTextCentered cardText-first">
                        <button type="button" class="itemAction textActionButton" title="New Adress" data-action="link" style="color: #fff;">New Adress</button>
                    </div>
                </div>
            </div>
        </div>
    </a>`;
    }
    return "";
};

const getInviteCard = (userId: string) => {
    return `
    <div id="inviteCard" class="card overflowBackdropCard card-hoverable card-withuserdata">
        <div class="cardBox cardBox-bottompadded">
            <div class="cardScalable">
                <div class="cardPadder
                cardPadder-overflowBackdrop lazy-hidden-children">

                    <button  class="cardImageContainer coveredImage cardContent " aria-label="Invite Codes" style="background-image: url('https://utils.jellyfin.nu/api/image?userId=${userId}&tvLayout=${layoutManager.tv}'); opacity: 1; display: flex; justify-content: center; align-items: center; flex-direction: column; gap: 4px; color: #fff;"></button><div class="cardOverlayContainer ">
                        <div class="cardOverlayButton-tr flex">Hej</div>
                    </div>
                </div>
                <div class="cardText cardTextCentered cardText-first">
                    <button type="button" class="itemAction textActionButton" title="Invite Codes" style="color: #fff;">Invite Codes</button>
                </div>
            </div>
        </div>
    </div>`;
};

const getJellyseerrCard = () => {
    const randomNr = Math.round(Math.random() * 5);
    return `<a href="https://mer.jellyfin.nu/">
    <div class="card overflowBackdropCard card-hoverable card-withuserdata">
        <div class="cardBox cardBox-bottompadded">
            <div class="cardScalable">
                <div class="cardPadder
                cardPadder-overflowBackdrop lazy-hidden-children">
                    <button data-action="link" class="cardImageContainer coveredImage cardContent itemAction " aria-label="Requests" style="background-image: url('https://images.jellyfin.nu/jellyseerr${randomNr}.webp'); opacity: 1; display: flex; justify-content: center; align-items: center; flex-direction: column; gap: 4px; color: #fff;"></button>
                    <div class="cardOverlayContainer itemAction" data-action="link">
                        <div class="cardOverlayButton-br flex"></div>
                    </div>
                </div>
                <div class="cardText cardTextCentered cardText-first">
                    <button type="button" class="itemAction textActionButton" title="Requests" data-action="link" style="color: #fff;">Requests</button>
                </div>
            </div>
        </div>
    </div>
</a>`;
};
