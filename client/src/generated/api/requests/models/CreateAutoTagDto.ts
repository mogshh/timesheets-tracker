/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type CreateAutoTagDto = {
    /**
     * Id of the tagName
     */
    tagNameId?: string;
    /**
     * Priority order in which the auto tags are checked
     */
    priority?: number;
    /**
     * Conditions for the auto tag
     */
    conditions?: string;
};
