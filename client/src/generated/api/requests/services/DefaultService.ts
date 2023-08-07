/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
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

}
