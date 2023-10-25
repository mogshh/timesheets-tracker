/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AutoTagDto } from '../models/AutoTagDto';
import type { CreateAutoTagDto } from '../models/CreateAutoTagDto';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class AutoTagsService {

    /**
     * @param requestBody 
     * @returns AutoTagDto Create an auto tag with conditions to identify when to apply the linked tagName to user activity
     * @throws ApiError
     */
    public static autoTagsControllerCreate(
requestBody: CreateAutoTagDto,
): CancelablePromise<AutoTagDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auto-tags',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * @param term 
     * @returns AutoTagDto Get a list of auto tags optionally filtered by a term that should occur in the name of the tag
     * @throws ApiError
     */
    public static autoTagsControllerFindAll(
term?: string,
): CancelablePromise<Array<AutoTagDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/auto-tags',
            query: {
                'term': term,
            },
        });
    }

    /**
     * @returns number Returns the number of auto tags that exist
     * @throws ApiError
     */
    public static autoTagsControllerCount(): CancelablePromise<number> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/auto-tags/count',
        });
    }

    /**
     * @param id 
     * @returns AutoTagDto Return a single auto tag by id
     * @throws ApiError
     */
    public static autoTagsControllerFindOne(
id: string,
): CancelablePromise<AutoTagDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/auto-tags/{id}',
            path: {
                'id': id,
            },
        });
    }

}
