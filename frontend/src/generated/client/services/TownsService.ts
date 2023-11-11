/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Canvas } from '../models/Canvas';
import type { Comment } from '../models/Comment';
import type { ConversationArea } from '../models/ConversationArea';
import type { GalleryCanvasModel } from '../models/GalleryCanvasModel';
import type { NewPixelData } from '../models/NewPixelData';
import type { PosterSessionArea } from '../models/PosterSessionArea';
import type { Town } from '../models/Town';
import type { TownCreateParams } from '../models/TownCreateParams';
import type { TownCreateResponse } from '../models/TownCreateResponse';
import type { TownSettingsUpdate } from '../models/TownSettingsUpdate';
import type { ViewingArea } from '../models/ViewingArea';

import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class TownsService {

    constructor(public readonly httpRequest: BaseHttpRequest) {}

    /**
     * List all towns that are set to be publicly available
     * @returns Town list of towns
     * @throws ApiError
     */
    public listTowns(): CancelablePromise<Array<Town>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/towns',
        });
    }

    /**
     * Create a new town
     * @param requestBody The public-facing information for the new town
     * @returns TownCreateResponse The ID of the newly created town, and a secret password that will be needed to update or delete this town.
     * @throws ApiError
     */
    public createTown(
        requestBody: TownCreateParams,
    ): CancelablePromise<TownCreateResponse> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/towns',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * Updates an existing town's settings by ID
     * @param townId town to update
     * @param xCoveyTownPassword town update password, must match the password returned by createTown
     * @param requestBody The updated settings
     * @returns void
     * @throws ApiError
     */
    public updateTown(
        townId: string,
        xCoveyTownPassword: string,
        requestBody: TownSettingsUpdate,
    ): CancelablePromise<void> {
        return this.httpRequest.request({
            method: 'PATCH',
            url: '/towns/{townID}',
            path: {
                'townID': townId,
            },
            headers: {
                'X-CoveyTown-Password': xCoveyTownPassword,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid password or update values specified`,
            },
        });
    }

    /**
     * Deletes a town
     * @param townId ID of the town to delete
     * @param xCoveyTownPassword town update password, must match the password returned by createTown
     * @returns void
     * @throws ApiError
     */
    public deleteTown(
        townId: string,
        xCoveyTownPassword: string,
    ): CancelablePromise<void> {
        return this.httpRequest.request({
            method: 'DELETE',
            url: '/towns/{townID}',
            path: {
                'townID': townId,
            },
            headers: {
                'X-CoveyTown-Password': xCoveyTownPassword,
            },
            errors: {
                400: `Invalid password or update values specified`,
            },
        });
    }

    /**
     * Creates a conversation area in a given town
     * @param townId ID of the town in which to create the new conversation area
     * @param xSessionToken session token of the player making the request, must match the session token returned when the player joined the town
     * @param requestBody The new conversation area to create
     * @returns void
     * @throws ApiError
     */
    public createConversationArea(
        townId: string,
        xSessionToken: string,
        requestBody: ConversationArea,
    ): CancelablePromise<void> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/towns/{townID}/conversationArea',
            path: {
                'townID': townId,
            },
            headers: {
                'X-Session-Token': xSessionToken,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid values specified`,
            },
        });
    }

    /**
     * Creates a viewing area in a given town
     * @param townId ID of the town in which to create the new viewing area
     * @param xSessionToken session token of the player making the request, must
     * match the session token returned when the player joined the town
     * @param requestBody The new viewing area to create
     * @returns void
     * @throws ApiError
     */
    public createViewingArea(
        townId: string,
        xSessionToken: string,
        requestBody: ViewingArea,
    ): CancelablePromise<void> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/towns/{townID}/viewingArea',
            path: {
                'townID': townId,
            },
            headers: {
                'X-Session-Token': xSessionToken,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid values specified`,
            },
        });
    }

    /**
     * Creates a poster session area in a given town
     * @param townId ID of the town in which to create the new poster session area
     * @param xSessionToken session token of the player making the request, must
     * match the session token returned when the player joined the town
     * @param requestBody The new poster session area to create
     * @returns void
     * @throws ApiError
     */
    public createPosterSessionArea(
        townId: string,
        xSessionToken: string,
        requestBody: PosterSessionArea,
    ): CancelablePromise<void> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/towns/{townID}/posterSessionArea',
            path: {
                'townID': townId,
            },
            headers: {
                'X-Session-Token': xSessionToken,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid values specified`,
            },
        });
    }

    /**
     * Creates a whiteboard area in a given town
     * @param townId ID of the town in which to create the new whiteboard area
     * @param xSessionToken session token of the player making the request, must
     * match the session token returned when the player joined the town
     * @param requestBody The new viewing area to create
     * @returns Canvas Ok
     * @throws ApiError
     */
    public createNewCanvas(
        townId: string,
        xSessionToken: string,
        requestBody: Canvas,
    ): CancelablePromise<Canvas> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/towns/{townID}/whiteboardArea/createCanvas',
            path: {
                'townID': townId,
            },
            headers: {
                'X-Session-Token': xSessionToken,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid values specified`,
            },
        });
    }

    /**
     * Gets the image contents of a given poster session area in a given town
     * @param townId ID of the town in which to get the poster session area image contents
     * @param posterSessionId interactable ID of the poster session
     * @param xSessionToken session token of the player making the request, must
     * match the session token returned when the player joined the town
     * @returns string Ok
     * @throws ApiError
     */
    public getPosterAreaImageContents(
        townId: string,
        posterSessionId: string,
        xSessionToken: string,
    ): CancelablePromise<string> {
        return this.httpRequest.request({
            method: 'PATCH',
            url: '/towns/{townID}/{posterSessionId}/imageContents',
            path: {
                'townID': townId,
                'posterSessionId': posterSessionId,
            },
            headers: {
                'X-Session-Token': xSessionToken,
            },
            errors: {
                400: `Invalid values specified`,
            },
        });
    }

    /**
     * Increment the stars of a given poster session area in a given town, as long as there is
     * a poster image. Returns the new number of stars.
     * @param townId ID of the town in which to get the poster session area image contents
     * @param posterSessionId interactable ID of the poster session
     * @param xSessionToken session token of the player making the request, must
     * match the session token returned when the player joined the town
     * @returns number Ok
     * @throws ApiError
     */
    public incrementPosterAreaStars(
        townId: string,
        posterSessionId: string,
        xSessionToken: string,
    ): CancelablePromise<number> {
        return this.httpRequest.request({
            method: 'PATCH',
            url: '/towns/{townID}/{posterSessionId}/incStars',
            path: {
                'townID': townId,
                'posterSessionId': posterSessionId,
            },
            headers: {
                'X-Session-Token': xSessionToken,
            },
            errors: {
                400: `Invalid values specified`,
            },
        });
    }

    /**
     * Gets the image contents of a given poster session area in a given town
     * @param townId ID of the town in which to get the poster session area image contents
     * @param xSessionToken session token of the player making the request, must
     * match the session token returned when the player joined the town
     * @returns Canvas Ok
     * @throws ApiError
     */
    public getCanvas(
        townId: string,
        xSessionToken: string,
    ): CancelablePromise<Canvas> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/towns/{townID}/whiteboardArea/canvas',
            path: {
                'townID': townId,
            },
            headers: {
                'X-Session-Token': xSessionToken,
            },
            errors: {
                400: `Invalid values specified`,
            },
        });
    }

    /**
     * Sets the pixels of a given whiteboard area in a given town
     * @param townId ID of the town in which to get the whiteboard area image contents
     * @param xSessionToken session token of the player making the request, must
     * match the session token returned when the player joined the town
     * @param requestBody
     * @returns Canvas Ok
     * @throws ApiError
     */
    public updateCanvas(
        townId: string,
        xSessionToken: string,
        requestBody: NewPixelData,
    ): CancelablePromise<Canvas> {
        return this.httpRequest.request({
            method: 'PATCH',
            url: '/towns/{townID}/whiteboardArea/canvas',
            path: {
                'townID': townId,
            },
            headers: {
                'X-Session-Token': xSessionToken,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid values specified`,
            },
        });
    }

    /**
     * @param townId
     * @param xSessionToken
     * @returns GalleryCanvasModel Ok
     * @throws ApiError
     */
    public getGallery(
        townId: string,
        xSessionToken: string,
    ): CancelablePromise<Array<GalleryCanvasModel>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/towns/{townID}/whiteboardArea/gallery',
            path: {
                'townID': townId,
            },
            headers: {
                'X-Session-Token': xSessionToken,
            },
            errors: {
                400: `Invalid values specified`,
            },
        });
    }

    /**
     * @param townId
     * @param xSessionToken
     * @returns Canvas Ok
     * @throws ApiError
     */
    public destroyCanvas(
        townId: string,
        xSessionToken: string,
    ): CancelablePromise<Canvas> {
        return this.httpRequest.request({
            method: 'PATCH',
            url: '/towns/{townID}/whiteboardArea/destroyCanvas',
            path: {
                'townID': townId,
            },
            headers: {
                'X-Session-Token': xSessionToken,
            },
            errors: {
                400: `Invalid values specified`,
            },
        });
    }

    /**
     * Adds a comment to the whiteboard area in a given town
     * @param townId ID of the town in which to get the whiteboard area
     * @param xSessionToken session token of the player making the request, must
     * match the session token returned when the player joined the town
     * @param requestBody comment to add
     * @returns Comment Ok
     * @throws ApiError
     */
    public addWhiteboardAreaComment(
        townId: string,
        xSessionToken: string,
        requestBody: Comment,
    ): CancelablePromise<Array<Comment>> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/towns/{townID}/whiteboardArea/comments',
            path: {
                'townID': townId,
            },
            headers: {
                'X-Session-Token': xSessionToken,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid values specified`,
            },
        });
    }

    /**
     * Clears the comments of the whiteboard area in a given town
     * @param townId ID of the town in which to get the whiteboard area
     * @param xSessionToken session token of the player making the request, must
     * match the session token returned when the player joined the town
     * @returns Comment Ok
     * @throws ApiError
     */
    public clearWhiteboardAreaComments(
        townId: string,
        xSessionToken: string,
    ): CancelablePromise<Array<Comment>> {
        return this.httpRequest.request({
            method: 'DELETE',
            url: '/towns/{townID}/whiteboardArea/comments',
            path: {
                'townID': townId,
            },
            headers: {
                'X-Session-Token': xSessionToken,
            },
            errors: {
                400: `Invalid values specified`,
            },
        });
    }

}
