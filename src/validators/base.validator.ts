import { expect } from '@playwright/test';
import { ApiResponse } from '../interfaces-and-dtos/apiResponse.interface';

export class BaseValidator {
    /**
     * Validates the status code
     * @param response - response to do validation on
     * @param expectedStatusCode - expected status code
     * @param optionalValidationMessage - optional message to inlcude in the expect
     */
    async validateStatusCode(
        response: ApiResponse<any>,
        expectedStatusCode: number,
        optionalValidationMessage?: string,
    ): Promise<void> {
        expect(response.status, optionalValidationMessage).toBe(expectedStatusCode);
    }

    /**
     * Validates that a subset of keys is present in teh response json
     * @param resJson - response to do validation on
     * @param keysToValidate - subset of keys to look for in the json
     */
    async validateResponseKeys(resJson: object, keysToValidate: any[]): Promise<void> {
        keysToValidate.forEach(key => {
            expect(resJson, `Response should contain key: ${key}`).toHaveProperty(key);
        });
    }

    /**
     * Validates that a subset of keys is not present in teh response json
     * @param resJson - response to do validation on
     * @param keysToValidate - subset of keys to look for in the json
     */
    async validateResponseDoesntHaveKeys(resJson: object, keysToValidate: any[]): Promise<void> {
        keysToValidate.forEach(key => {
            expect(resJson, `Response should contain key: ${key}`).not.toHaveProperty(key);
        });
    }

    /**
     * Validates the key value pair
     * @param resJson - response to do validation on
     * @param expectedKey - expected key to valdiate
     * @param expectedValue - expected value of the specified key
     * @param optionalValidationMessage - optional message to inlcude in the expect
     */
    async validateKeyValuePair(
        resJson: object,
        expectedKey: string,
        expectedValue: any,
        optionalValidationMessage?: string,
    ): Promise<void> {
        expect(resJson, optionalValidationMessage).toHaveProperty(expectedKey, expectedValue);
    }

    /**
     * Validates all similar key-value pairs in an array of similar objects
     * @param objectsArray - an array of similar objects
     * @param expectedKey - expected key to valdiate
     * @param expectedValue - expected value of the specified key
     * @param optionalValidationMessage - optional message to inlcude in the expect
     */
    async validateKeyValuePairsInObjectsArray(
        objectsArray: object[],
        expectedKey: string,
        expectedValue: any,
        optionalValidationMessage?: string,
    ): Promise<void> {
        objectsArray.forEach(obj => expect(obj[expectedKey], optionalValidationMessage).toContain(expectedValue));
    }
}
