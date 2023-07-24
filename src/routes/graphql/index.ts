import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema } from './schemas.js';
import { graphql, parse, validate } from 'graphql';
import schema from './schema/graphQlSchema.js';
import depthLimit from 'graphql-depth-limit';

const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
  fastify.route({
    url: '/',
    method: 'POST',
    schema: {
      ...createGqlResponseSchema,
      response: {
        200: gqlResponseSchema,
      },
    },
    async handler(req) {
      const validateResult = validate(schema, parse(req.body.query), [depthLimit(5)]);

      if (validateResult.length) {
        return { errors: validateResult };
      }
      return await graphql({
        schema,
        source: String(req.body.query),
        contextValue: fastify,
        variableValues: req.body.variables,
      });
    },
  });
};

export default plugin;
