import React, { useState } from 'react';

const InputSpecBuilder = ({ inputSpec, setInputSpec, onPreview }) => {
  const [inputs, setInputs] = useState(inputSpec?.inputs || []);
  const [formatTemplate, setFormatTemplate] = useState(inputSpec?.format?.template || []);

  const addInput = () => {
    setInputs([
      ...inputs,
      {
        name: '',
        type: 'integer',
        min: 1,
        max: 100
      }
    ]);
  };

  const removeInput = (index) => {
    const newInputs = inputs.filter((_, i) => i !== index);
    setInputs(newInputs);
    updateInputSpec(newInputs, formatTemplate);
  };

  const updateInput = (index, field, value) => {
    const newInputs = inputs.map((input, i) => {
      if (i === index) {
        // When changing type, reset type-specific fields
        if (field === 'type') {
          const baseInput = { name: input.name, type: value };

          switch (value) {
            case 'integer':
              return { ...baseInput, min: 1, max: 100 };
            case 'array_1d':
              return {
                ...baseInput,
                length: { min: 1, max: 100 },
                elementMin: 1,
                elementMax: 1000
              };
            case 'string':
              return {
                ...baseInput,
                minLength: 1,
                maxLength: 100,
                charset: 'lowercase'
              };
            default:
              return baseInput;
          }
        }
        return { ...input, [field]: value };
      }
      return input;
    });
    setInputs(newInputs);
    updateInputSpec(newInputs, formatTemplate);
  };

  const updateInputSpec = (newInputs, newTemplate) => {
    setInputSpec({
      inputs: newInputs,
      format: newTemplate.length > 0 ? { template: newTemplate } : undefined
    });
  };

  const addFormatLine = () => {
    const newTemplate = [...formatTemplate, ''];
    setFormatTemplate(newTemplate);
    updateInputSpec(inputs, newTemplate);
  };

  const updateFormatLine = (index, value) => {
    const newTemplate = formatTemplate.map((line, i) => (i === index ? value : line));
    setFormatTemplate(newTemplate);
    updateInputSpec(inputs, newTemplate);
  };

  const removeFormatLine = (index) => {
    const newTemplate = formatTemplate.filter((_, i) => i !== index);
    setFormatTemplate(newTemplate);
    updateInputSpec(inputs, newTemplate);
  };

  return (
    <div className="border p-4 rounded-md bg-gray-50">
      <h3 className="text-xl font-semibold mb-4">Input Specification Builder</h3>

      <div className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <h4 className="font-bold">Parameters</h4>
          <button
            type="button"
            onClick={addInput}
            className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
          >
            Add Parameter
          </button>
        </div>

        {inputs.map((input, index) => (
          <div key={index} className="mb-4 p-3 border rounded bg-white">
            <div className="grid grid-cols-2 gap-3 mb-2">
              <div>
                <label className="block text-sm font-bold mb-1">Parameter Name</label>
                <input
                  type="text"
                  value={input.name}
                  onChange={(e) => updateInput(index, 'name', e.target.value)}
                  placeholder="e.g., n, arr, str"
                  className="w-full px-2 py-1 border rounded text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-bold mb-1">Type</label>
                <select
                  value={input.type}
                  onChange={(e) => updateInput(index, 'type', e.target.value)}
                  className="w-full px-2 py-1 border rounded text-sm"
                >
                  <option value="integer">Integer</option>
                  <option value="array_1d">1D Array</option>
                  <option value="string">String</option>
                </select>
              </div>
            </div>

            {/* Type-specific fields */}
            {input.type === 'integer' && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-bold mb-1">Min Value</label>
                  <input
                    type="number"
                    value={input.min}
                    onChange={(e) => updateInput(index, 'min', parseInt(e.target.value))}
                    className="w-full px-2 py-1 border rounded text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1">Max Value</label>
                  <input
                    type="number"
                    value={input.max}
                    onChange={(e) => updateInput(index, 'max', parseInt(e.target.value))}
                    className="w-full px-2 py-1 border rounded text-sm"
                  />
                </div>
              </div>
            )}

            {input.type === 'array_1d' && (
              <div>
                <div className="grid grid-cols-2 gap-3 mb-2">
                  <div>
                    <label className="block text-sm font-bold mb-1">Min Length</label>
                    <input
                      type="number"
                      value={input.length?.min || 1}
                      onChange={(e) =>
                        updateInput(index, 'length', { ...input.length, min: parseInt(e.target.value) })
                      }
                      className="w-full px-2 py-1 border rounded text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-1">Max Length</label>
                    <input
                      type="number"
                      value={input.length?.max || 100}
                      onChange={(e) =>
                        updateInput(index, 'length', { ...input.length, max: parseInt(e.target.value) })
                      }
                      className="w-full px-2 py-1 border rounded text-sm"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-bold mb-1">Element Min</label>
                    <input
                      type="number"
                      value={input.elementMin}
                      onChange={(e) => updateInput(index, 'elementMin', parseInt(e.target.value))}
                      className="w-full px-2 py-1 border rounded text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-1">Element Max</label>
                    <input
                      type="number"
                      value={input.elementMax}
                      onChange={(e) => updateInput(index, 'elementMax', parseInt(e.target.value))}
                      className="w-full px-2 py-1 border rounded text-sm"
                    />
                  </div>
                </div>
              </div>
            )}

            {input.type === 'string' && (
              <div>
                <div className="grid grid-cols-2 gap-3 mb-2">
                  <div>
                    <label className="block text-sm font-bold mb-1">Min Length</label>
                    <input
                      type="number"
                      value={input.minLength}
                      onChange={(e) => updateInput(index, 'minLength', parseInt(e.target.value))}
                      className="w-full px-2 py-1 border rounded text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-1">Max Length</label>
                    <input
                      type="number"
                      value={input.maxLength}
                      onChange={(e) => updateInput(index, 'maxLength', parseInt(e.target.value))}
                      className="w-full px-2 py-1 border rounded text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1">Character Set</label>
                  <select
                    value={input.charset || 'lowercase'}
                    onChange={(e) => updateInput(index, 'charset', e.target.value)}
                    className="w-full px-2 py-1 border rounded text-sm"
                  >
                    <option value="lowercase">Lowercase (a-z)</option>
                    <option value="uppercase">Uppercase (A-Z)</option>
                    <option value="digits">Digits (0-9)</option>
                    <option value="alphanumeric">Alphanumeric</option>
                    <option value="all">All (with symbols)</option>
                  </select>
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={() => removeInput(index)}
              className="mt-2 px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      {/* Format Template Section */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-3">
          <h4 className="font-bold">Format Template (Optional)</h4>
          <button
            type="button"
            onClick={addFormatLine}
            className="px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600"
          >
            Add Line
          </button>
        </div>
        <p className="text-sm text-gray-600 mb-2">
          Use placeholders like {'{n}'} or {'{arr}'}. Leave empty for default format.
        </p>

        {formatTemplate.map((line, index) => (
          <div key={index} className="flex gap-2 mb-2">
            <input
              type="text"
              value={line}
              onChange={(e) => updateFormatLine(index, e.target.value)}
              placeholder="e.g., {n} {m}"
              className="flex-1 px-2 py-1 border rounded text-sm"
            />
            <button
              type="button"
              onClick={() => removeFormatLine(index)}
              className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      {/* Preview Button */}
      {inputs.length > 0 && onPreview && (
        <button
          type="button"
          onClick={onPreview}
          className="w-full px-4 py-2 bg-purple-500 text-white font-semibold rounded hover:bg-purple-600"
        >
          Preview Test Case
        </button>
      )}
    </div>
  );
};

export default InputSpecBuilder;
