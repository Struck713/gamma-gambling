import Ajv from 'ajv';

export function validateBody(schema: any) {
  const ajv = new Ajv();
  const validate = ajv.compile(schema);
  return (req: any, res: any, next: any) => {
    const valid = validate(req.body);
    if (valid) {
      return next();
    } else {
      if (!validate.errors) return next();
      
      const error = validate.errors[0];
      return res.status(400).json({
        error: {
          message: `"${error.instancePath.substring(1)}" ${error.message}`,
        },
      });
    }
  };
}