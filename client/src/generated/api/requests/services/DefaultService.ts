/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateTagDto } from '../models/CreateTagDto';
import type { CreateTagNameDto } from '../models/CreateTagNameDto';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class DefaultService {

    /**
     * @returns any 
     * @throws ApiError
     */
    public static appControllerStatus(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/',
        });
    }

    /**
     * @returns any 
     * @throws ApiError
     */
    public static activitiesControllerCreate(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/activities',
        });
    }

    /**
     * @param startedAt 
     * @param endedAt 
     * @returns any 
     * @throws ApiError
     */
    public static activitiesControllerFindAll(
startedAt: string,
endedAt: string,
): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/activities',
            query: {
                'startedAt': startedAt,
                'endedAt': endedAt,
            },
        });
    }

    /**
     * @param requestBody 
     * @returns any 
     * @throws ApiError
     */
    public static tagsControllerCreate(
requestBody: CreateTagDto,
): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/tags',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * @param startedAt 
     * @param endedAt 
     * @returns any 
     * @throws ApiError
     */
    public static tagsControllerFindAll(
startedAt: string,
endedAt: string,
): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/tags',
            query: {
                'startedAt': startedAt,
                'endedAt': endedAt,
            },
        });
    }

    /**
     * @param requestBody 
     * @returns any 
     * @throws ApiError
     */
    public static tagNamesControllerCreate(
requestBody: CreateTagNameDto,
): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/tag-names',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * @param term 
     * @returns any 
     * @throws ApiError
     */
    public static tagNamesControllerFindAll(
term: string,
): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/tag-names',
            query: {
                'term': term,
            },
        });
    }

    /**
     * @returns any 
     * @throws ApiError
     */
    public static tagNamesControllerCount(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/tag-names/count',
        });
    }

}
