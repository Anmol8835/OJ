/**
 * Test Case Generators for Phase 1
 * Supports: integer, 1D array, string
 */

/**
 * Generate a random integer within a range
 * @param {number} min - Minimum value (inclusive)
 * @param {number} max - Maximum value (inclusive)
 * @returns {number}
 */
function generateInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Generate a random 1D array
 * @param {number} length - Length of the array
 * @param {number} elementMin - Minimum value for elements
 * @param {number} elementMax - Maximum value for elements
 * @returns {number[]}
 */
function generateArray1D(length, elementMin, elementMax) {
    const arr = [];
    for (let i = 0; i < length; i++) {
        arr.push(generateInteger(elementMin, elementMax));
    }
    return arr;
}

/**
 * Generate a random string
 * @param {number} minLength - Minimum length
 * @param {number} maxLength - Maximum length
 * @param {string} charset - Character set to use ('lowercase', 'uppercase', 'digits', 'alphanumeric', 'all')
 * @returns {string}
 */
function generateString(minLength, maxLength, charset = 'lowercase') {
    const charsets = {
        lowercase: 'abcdefghijklmnopqrstuvwxyz',
        uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
        digits: '0123456789',
        alphanumeric: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
        all: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()',
    };

    const chars = charsets[charset] || charsets.lowercase;
    const length = generateInteger(minLength, maxLength);
    let result = '';

    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    return result;
}

/**
 * Generate edge case values for testing
 * @param {Object} param - Parameter specification
 * @returns {any}
 */
function generateEdgeCase(param) {
    const { type, min, max, length, elementMin, elementMax, minLength, maxLength, charset } = param;

    // For integers, return min or max
    if (type === 'integer') {
        return Math.random() < 0.5 ? min : max;
    }

    // For arrays, return minimum or maximum length
    if (type === 'array_1d') {
        const len = Math.random() < 0.5 ? length.min : length.max;
        return generateArray1D(len, elementMin, elementMax);
    }

    // For strings, return minimum or maximum length
    if (type === 'string') {
        const len = Math.random() < 0.5 ? minLength : maxLength;
        return generateString(len, len, charset);
    }

    return null;
}

/**
 * Generate test case based on input specification
 * @param {Object} inputSpec - Input specification
 * @param {boolean} isEdgeCase - Whether to generate edge case
 * @returns {Object} - Generated input values
 */
function generateTestInput(inputSpec, isEdgeCase = false) {
    const generatedValues = {};

    for (const param of inputSpec.inputs) {
        const { name, type } = param;

        if (isEdgeCase) {
            generatedValues[name] = generateEdgeCase(param);
            continue;
        }

        switch (type) {
            case 'integer': {
                const { min, max } = param;
                generatedValues[name] = generateInteger(min, max);
                break;
            }

            case 'array_1d': {
                const { length, elementMin, elementMax } = param;
                // Check if length is a reference to another parameter
                const arrayLength = typeof length === 'string'
                    ? generatedValues[length]
                    : generateInteger(length.min, length.max);
                generatedValues[name] = generateArray1D(arrayLength, elementMin, elementMax);
                break;
            }

            case 'string': {
                const { minLength, maxLength, charset = 'lowercase' } = param;
                generatedValues[name] = generateString(minLength, maxLength, charset);
                break;
            }

            default:
                throw new Error(`Unsupported type: ${type}`);
        }
    }

    return generatedValues;
}

module.exports = {
    generateInteger,
    generateArray1D,
    generateString,
    generateEdgeCase,
    generateTestInput
};
