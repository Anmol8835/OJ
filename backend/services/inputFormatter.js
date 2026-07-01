/**
 * Input Formatter Service
 * Converts generated values to formatted text based on template
 */

/**
 * Format generated values according to the input specification
 * @param {Object} generatedValues - The generated input values
 * @param {Object} inputSpec - Input specification with format template
 * @returns {string} - Formatted input text
 */
function formatInput(generatedValues, inputSpec) {
    if (!inputSpec.format || !inputSpec.format.template) {
        // Default format: print each value on a new line
        return defaultFormat(generatedValues, inputSpec);
    }

    // Use custom template
    return customFormat(generatedValues, inputSpec.format.template);
}

/**
 * Default formatting: each parameter on a new line
 * Arrays are space-separated on one line
 * @param {Object} generatedValues
 * @param {Object} inputSpec
 * @returns {string}
 */
function defaultFormat(generatedValues, inputSpec) {
    const lines = [];

    for (const param of inputSpec.inputs) {
        const value = generatedValues[param.name];

        if (param.type === 'array_1d') {
            lines.push(value.join(' '));
        } else {
            lines.push(String(value));
        }
    }

    return lines.join('\n');
}

/**
 * Custom formatting using template
 * Template uses placeholders like {variableName} and {array[i]}
 *
 * Example templates:
 * - "{n}\n{arr}"  -> First line: n, Second line: array space-separated
 * - "{n} {m}\n{arr}"  -> First line: n and m, Second line: array
 *
 * @param {Object} generatedValues
 * @param {Array} template - Array of line templates
 * @returns {string}
 */
function customFormat(generatedValues, template) {
    const lines = [];

    for (const lineTemplate of template) {
        let line = lineTemplate;

        // Replace all placeholders
        for (const [key, value] of Object.entries(generatedValues)) {
            const placeholder = `{${key}}`;

            if (line.includes(placeholder)) {
                if (Array.isArray(value)) {
                    // For arrays, join with space
                    line = line.replace(placeholder, value.join(' '));
                } else {
                    line = line.replace(placeholder, String(value));
                }
            }
        }

        lines.push(line);
    }

    return lines.join('\n');
}

/**
 * Parse input specification and validate
 * @param {Object} inputSpec
 * @returns {boolean}
 */
function validateInputSpec(inputSpec) {
    if (!inputSpec || !inputSpec.inputs || !Array.isArray(inputSpec.inputs)) {
        return false;
    }

    for (const param of inputSpec.inputs) {
        if (!param.name || !param.type) {
            return false;
        }

        // Validate based on type
        switch (param.type) {
            case 'integer':
                if (param.min === undefined || param.max === undefined) {
                    return false;
                }
                break;
            case 'array_1d':
                if (!param.length || param.elementMin === undefined || param.elementMax === undefined) {
                    return false;
                }
                break;
            case 'string':
                if (param.minLength === undefined || param.maxLength === undefined) {
                    return false;
                }
                break;
            default:
                return false;
        }
    }

    return true;
}

module.exports = {
    formatInput,
    validateInputSpec
};
