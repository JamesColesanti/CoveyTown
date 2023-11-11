/* tslint:disable */
/* eslint-disable */
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { Controller, ValidationService, FieldErrors, ValidateError, TsoaRoute, HttpStatusCodeLiteral, TsoaResponse, fetchMiddlewares } from '@tsoa/runtime';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { TownsController } from './../src/town/TownsController';
import type { RequestHandler } from 'express';
import * as express from 'express';

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

const models: TsoaRoute.Models = {
    "Town": {
        "dataType": "refObject",
        "properties": {
            "friendlyName": {"dataType":"string","required":true},
            "townID": {"dataType":"string","required":true},
            "currentOccupancy": {"dataType":"double","required":true},
            "maximumOccupancy": {"dataType":"double","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "TownCreateResponse": {
        "dataType": "refObject",
        "properties": {
            "townID": {"dataType":"string","required":true},
            "townUpdatePassword": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "TownCreateParams": {
        "dataType": "refObject",
        "properties": {
            "friendlyName": {"dataType":"string","required":true},
            "isPubliclyListed": {"dataType":"boolean","required":true},
            "mapFile": {"dataType":"string"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "InvalidParametersError": {
        "dataType": "refObject",
        "properties": {
            "code": {"dataType":"undefined","required":true},
            "message": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "TownSettingsUpdate": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"isPubliclyListed":{"dataType":"boolean"},"friendlyName":{"dataType":"string"}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ConversationArea": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"string","required":true},
            "topic": {"dataType":"string"},
            "occupantsByID": {"dataType":"array","array":{"dataType":"string"},"required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ViewingArea": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"string","required":true},
            "video": {"dataType":"string"},
            "isPlaying": {"dataType":"boolean","required":true},
            "elapsedTimeSec": {"dataType":"double","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "PosterSessionArea": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"string","required":true},
            "stars": {"dataType":"double","required":true},
            "imageContents": {"dataType":"string"},
            "title": {"dataType":"string"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Color": {
        "dataType": "refObject",
        "properties": {
            "r": {"dataType":"double","required":true},
            "g": {"dataType":"double","required":true},
            "b": {"dataType":"double","required":true},
            "a": {"dataType":"double","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Pixel": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"string","required":true},
            "x": {"dataType":"double","required":true},
            "y": {"dataType":"double","required":true},
            "color": {"ref":"Color","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Canvas": {
        "dataType": "refObject",
        "properties": {
            "name": {"dataType":"string","required":true},
            "pixels": {"dataType":"array","array":{"dataType":"refObject","ref":"Pixel"},"required":true},
            "timeCreated": {"dataType":"double","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "GalleryCanvasModel": {
        "dataType": "refObject",
        "properties": {
            "name": {"dataType":"string","required":true},
            "history": {"dataType":"array","array":{"dataType":"array","array":{"dataType":"refObject","ref":"Pixel"}},"required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "NewPixelData": {
        "dataType": "refObject",
        "properties": {
            "pixInd": {"dataType":"double","required":true},
            "color": {"ref":"Color","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Comment": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"string","required":true},
            "author": {"dataType":"string","required":true},
            "text": {"dataType":"string","required":true},
            "dateCreated": {"dataType":"string","required":true},
            "replies": {"dataType":"array","array":{"dataType":"refObject","ref":"Comment"},"required":true},
            "parentCommentId": {"dataType":"string"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
};
const validationService = new ValidationService(models);

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

export function RegisterRoutes(app: express.Router) {
    // ###########################################################################################################
    //  NOTE: If you do not see routes for all of your controllers in this file, then you might not have informed tsoa of where to look
    //      Please look into the "controllerPathGlobs" config option described in the readme: https://github.com/lukeautry/tsoa
    // ###########################################################################################################
        app.get('/towns',
            ...(fetchMiddlewares<RequestHandler>(TownsController)),
            ...(fetchMiddlewares<RequestHandler>(TownsController.prototype.listTowns)),

            function TownsController_listTowns(request: any, response: any, next: any) {
            const args = {
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new TownsController();


              const promise = controller.listTowns.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/towns',
            ...(fetchMiddlewares<RequestHandler>(TownsController)),
            ...(fetchMiddlewares<RequestHandler>(TownsController.prototype.createTown)),

            function TownsController_createTown(request: any, response: any, next: any) {
            const args = {
                    request: {"in":"body","name":"request","required":true,"ref":"TownCreateParams"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new TownsController();


              const promise = controller.createTown.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.patch('/towns/:townID',
            ...(fetchMiddlewares<RequestHandler>(TownsController)),
            ...(fetchMiddlewares<RequestHandler>(TownsController.prototype.updateTown)),

            function TownsController_updateTown(request: any, response: any, next: any) {
            const args = {
                    townID: {"in":"path","name":"townID","required":true,"dataType":"string"},
                    townUpdatePassword: {"in":"header","name":"X-CoveyTown-Password","required":true,"dataType":"string"},
                    requestBody: {"in":"body","name":"requestBody","required":true,"ref":"TownSettingsUpdate"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new TownsController();


              const promise = controller.updateTown.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.delete('/towns/:townID',
            ...(fetchMiddlewares<RequestHandler>(TownsController)),
            ...(fetchMiddlewares<RequestHandler>(TownsController.prototype.deleteTown)),

            function TownsController_deleteTown(request: any, response: any, next: any) {
            const args = {
                    townID: {"in":"path","name":"townID","required":true,"dataType":"string"},
                    townUpdatePassword: {"in":"header","name":"X-CoveyTown-Password","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new TownsController();


              const promise = controller.deleteTown.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/towns/:townID/conversationArea',
            ...(fetchMiddlewares<RequestHandler>(TownsController)),
            ...(fetchMiddlewares<RequestHandler>(TownsController.prototype.createConversationArea)),

            function TownsController_createConversationArea(request: any, response: any, next: any) {
            const args = {
                    townID: {"in":"path","name":"townID","required":true,"dataType":"string"},
                    sessionToken: {"in":"header","name":"X-Session-Token","required":true,"dataType":"string"},
                    requestBody: {"in":"body","name":"requestBody","required":true,"ref":"ConversationArea"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new TownsController();


              const promise = controller.createConversationArea.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/towns/:townID/viewingArea',
            ...(fetchMiddlewares<RequestHandler>(TownsController)),
            ...(fetchMiddlewares<RequestHandler>(TownsController.prototype.createViewingArea)),

            function TownsController_createViewingArea(request: any, response: any, next: any) {
            const args = {
                    townID: {"in":"path","name":"townID","required":true,"dataType":"string"},
                    sessionToken: {"in":"header","name":"X-Session-Token","required":true,"dataType":"string"},
                    requestBody: {"in":"body","name":"requestBody","required":true,"ref":"ViewingArea"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new TownsController();


              const promise = controller.createViewingArea.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/towns/:townID/posterSessionArea',
            ...(fetchMiddlewares<RequestHandler>(TownsController)),
            ...(fetchMiddlewares<RequestHandler>(TownsController.prototype.createPosterSessionArea)),

            function TownsController_createPosterSessionArea(request: any, response: any, next: any) {
            const args = {
                    townID: {"in":"path","name":"townID","required":true,"dataType":"string"},
                    sessionToken: {"in":"header","name":"X-Session-Token","required":true,"dataType":"string"},
                    requestBody: {"in":"body","name":"requestBody","required":true,"ref":"PosterSessionArea"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new TownsController();


              const promise = controller.createPosterSessionArea.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/towns/:townID/whiteboardArea/createCanvas',
            ...(fetchMiddlewares<RequestHandler>(TownsController)),
            ...(fetchMiddlewares<RequestHandler>(TownsController.prototype.createNewCanvas)),

            function TownsController_createNewCanvas(request: any, response: any, next: any) {
            const args = {
                    townID: {"in":"path","name":"townID","required":true,"dataType":"string"},
                    sessionToken: {"in":"header","name":"X-Session-Token","required":true,"dataType":"string"},
                    requestBody: {"in":"body","name":"requestBody","required":true,"ref":"Canvas"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new TownsController();


              const promise = controller.createNewCanvas.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.patch('/towns/:townID/:posterSessionId/imageContents',
            ...(fetchMiddlewares<RequestHandler>(TownsController)),
            ...(fetchMiddlewares<RequestHandler>(TownsController.prototype.getPosterAreaImageContents)),

            function TownsController_getPosterAreaImageContents(request: any, response: any, next: any) {
            const args = {
                    townID: {"in":"path","name":"townID","required":true,"dataType":"string"},
                    posterSessionId: {"in":"path","name":"posterSessionId","required":true,"dataType":"string"},
                    sessionToken: {"in":"header","name":"X-Session-Token","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new TownsController();


              const promise = controller.getPosterAreaImageContents.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.patch('/towns/:townID/:posterSessionId/incStars',
            ...(fetchMiddlewares<RequestHandler>(TownsController)),
            ...(fetchMiddlewares<RequestHandler>(TownsController.prototype.incrementPosterAreaStars)),

            function TownsController_incrementPosterAreaStars(request: any, response: any, next: any) {
            const args = {
                    townID: {"in":"path","name":"townID","required":true,"dataType":"string"},
                    posterSessionId: {"in":"path","name":"posterSessionId","required":true,"dataType":"string"},
                    sessionToken: {"in":"header","name":"X-Session-Token","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new TownsController();


              const promise = controller.incrementPosterAreaStars.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/towns/:townID/whiteboardArea/canvas',
            ...(fetchMiddlewares<RequestHandler>(TownsController)),
            ...(fetchMiddlewares<RequestHandler>(TownsController.prototype.getCanvas)),

            function TownsController_getCanvas(request: any, response: any, next: any) {
            const args = {
                    townID: {"in":"path","name":"townID","required":true,"dataType":"string"},
                    sessionToken: {"in":"header","name":"X-Session-Token","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new TownsController();


              const promise = controller.getCanvas.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/towns/:townID/whiteboardArea/gallery',
            ...(fetchMiddlewares<RequestHandler>(TownsController)),
            ...(fetchMiddlewares<RequestHandler>(TownsController.prototype.getGallery)),

            function TownsController_getGallery(request: any, response: any, next: any) {
            const args = {
                    townID: {"in":"path","name":"townID","required":true,"dataType":"string"},
                    sessionToken: {"in":"header","name":"X-Session-Token","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new TownsController();


              const promise = controller.getGallery.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.patch('/towns/:townID/whiteboardArea/canvas',
            ...(fetchMiddlewares<RequestHandler>(TownsController)),
            ...(fetchMiddlewares<RequestHandler>(TownsController.prototype.updateCanvas)),

            function TownsController_updateCanvas(request: any, response: any, next: any) {
            const args = {
                    townID: {"in":"path","name":"townID","required":true,"dataType":"string"},
                    sessionToken: {"in":"header","name":"X-Session-Token","required":true,"dataType":"string"},
                    requestBody: {"in":"body","name":"requestBody","required":true,"ref":"NewPixelData"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new TownsController();


              const promise = controller.updateCanvas.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.patch('/towns/:townID/whiteboardArea/destroyCanvas',
            ...(fetchMiddlewares<RequestHandler>(TownsController)),
            ...(fetchMiddlewares<RequestHandler>(TownsController.prototype.destroyCanvas)),

            function TownsController_destroyCanvas(request: any, response: any, next: any) {
            const args = {
                    townID: {"in":"path","name":"townID","required":true,"dataType":"string"},
                    sessionToken: {"in":"header","name":"X-Session-Token","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new TownsController();


              const promise = controller.destroyCanvas.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/towns/:townID/whiteboardArea/comments',
            ...(fetchMiddlewares<RequestHandler>(TownsController)),
            ...(fetchMiddlewares<RequestHandler>(TownsController.prototype.addWhiteboardAreaComment)),

            function TownsController_addWhiteboardAreaComment(request: any, response: any, next: any) {
            const args = {
                    townID: {"in":"path","name":"townID","required":true,"dataType":"string"},
                    sessionToken: {"in":"header","name":"X-Session-Token","required":true,"dataType":"string"},
                    requestBody: {"in":"body","name":"requestBody","required":true,"ref":"Comment"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new TownsController();


              const promise = controller.addWhiteboardAreaComment.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.delete('/towns/:townID/whiteboardArea/comments',
            ...(fetchMiddlewares<RequestHandler>(TownsController)),
            ...(fetchMiddlewares<RequestHandler>(TownsController.prototype.clearWhiteboardAreaComments)),

            function TownsController_clearWhiteboardAreaComments(request: any, response: any, next: any) {
            const args = {
                    townID: {"in":"path","name":"townID","required":true,"dataType":"string"},
                    sessionToken: {"in":"header","name":"X-Session-Token","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new TownsController();


              const promise = controller.clearWhiteboardAreaComments.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa


    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

    function isController(object: any): object is Controller {
        return 'getHeaders' in object && 'getStatus' in object && 'setStatus' in object;
    }

    function promiseHandler(controllerObj: any, promise: any, response: any, successStatus: any, next: any) {
        return Promise.resolve(promise)
            .then((data: any) => {
                let statusCode = successStatus;
                let headers;
                if (isController(controllerObj)) {
                    headers = controllerObj.getHeaders();
                    statusCode = controllerObj.getStatus() || statusCode;
                }

                // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

                returnHandler(response, statusCode, data, headers)
            })
            .catch((error: any) => next(error));
    }

    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

    function returnHandler(response: any, statusCode?: number, data?: any, headers: any = {}) {
        if (response.headersSent) {
            return;
        }
        Object.keys(headers).forEach((name: string) => {
            response.set(name, headers[name]);
        });
        if (data && typeof data.pipe === 'function' && data.readable && typeof data._read === 'function') {
            data.pipe(response);
        } else if (data !== null && data !== undefined) {
            response.status(statusCode || 200).json(data);
        } else {
            response.status(statusCode || 204).end();
        }
    }

    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

    function responder(response: any): TsoaResponse<HttpStatusCodeLiteral, unknown>  {
        return function(status, data, headers) {
            returnHandler(response, status, data, headers);
        };
    };

    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

    function getValidatedArgs(args: any, request: any, response: any): any[] {
        const fieldErrors: FieldErrors  = {};
        const values = Object.keys(args).map((key) => {
            const name = args[key].name;
            switch (args[key].in) {
                case 'request':
                    return request;
                case 'query':
                    return validationService.ValidateParam(args[key], request.query[name], name, fieldErrors, undefined, {"noImplicitAdditionalProperties":"throw-on-extras"});
                case 'path':
                    return validationService.ValidateParam(args[key], request.params[name], name, fieldErrors, undefined, {"noImplicitAdditionalProperties":"throw-on-extras"});
                case 'header':
                    return validationService.ValidateParam(args[key], request.header(name), name, fieldErrors, undefined, {"noImplicitAdditionalProperties":"throw-on-extras"});
                case 'body':
                    return validationService.ValidateParam(args[key], request.body, name, fieldErrors, undefined, {"noImplicitAdditionalProperties":"throw-on-extras"});
                case 'body-prop':
                    return validationService.ValidateParam(args[key], request.body[name], name, fieldErrors, 'body.', {"noImplicitAdditionalProperties":"throw-on-extras"});
                case 'formData':
                    if (args[key].dataType === 'file') {
                        return validationService.ValidateParam(args[key], request.file, name, fieldErrors, undefined, {"noImplicitAdditionalProperties":"throw-on-extras"});
                    } else if (args[key].dataType === 'array' && args[key].array.dataType === 'file') {
                        return validationService.ValidateParam(args[key], request.files, name, fieldErrors, undefined, {"noImplicitAdditionalProperties":"throw-on-extras"});
                    } else {
                        return validationService.ValidateParam(args[key], request.body[name], name, fieldErrors, undefined, {"noImplicitAdditionalProperties":"throw-on-extras"});
                    }
                case 'res':
                    return responder(response);
            }
        });

        if (Object.keys(fieldErrors).length > 0) {
            throw new ValidateError(fieldErrors, '');
        }
        return values;
    }

    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
}

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
