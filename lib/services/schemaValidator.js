const Ajv = require('ajv')

function schemaValidator (schema, data) {
  const ajv = new Ajv({allErrors: true, jsonPointers: true})
  require('ajv-errors')(ajv /*, {singleError: true} */)
  const validate = ajv.compile(schema)
  const valid = validate(data);
  if (!valid) {
    return {
      isValid: false,
      friendly: validate.errors
        .reduce((acc, cur) => {
          if (cur.params.additionalProperty) {
            acc[cur.params.additionalProperty] = cur.message
          } else if (cur.params.missingProperty) {
            acc[cur.params.missingProperty] = cur.message
          } else {
            acc[cur.dataPath.substr(1)] = cur.message
          }
          return acc
        }, {}),
      ...validate.errors
    }
  } else {
    return {
      isValid: true
    }
  }
}

module.exports = schemaValidator
