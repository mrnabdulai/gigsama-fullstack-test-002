import { ObjectSchema } from "yup";

const validate =
  (
    schema: ObjectSchema<{
      body: any;
      params: any;
      query: any;
    }>
  ) =>
  async (req, res, next) => {
    try {
      const schemaKeys = Object.keys(schema.describe().fields);
      await schema.validate({
        ...(schemaKeys.includes("body") ? { body: req.body } : {}),
        ...(schemaKeys.includes("query") ? { query: req.query } : {}),
        ...(schemaKeys.includes("params") ? { params: req.params } : {}),
      });
      return next();
    } catch (err) {
      return res.status(400).json({ type: err.name, message: err.message });
    }
  };

export default validate;
