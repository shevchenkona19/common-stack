
import { graphqlExpress, ExpressHandler } from 'graphql-server-express';
import { GraphQLOptions } from 'graphql-server-core';
import 'isomorphic-fetch';
import { logger } from '@common-stack/utils';
import * as express from 'express';
import { counterRepo } from '../container';
import { schema } from '../api/schema';
import { database } from '@common-stack/graphql-schema';
import { ICounterRepository, TYPES as CounterTypes } from '@common-stack/store';

const { persons, findPerson, addPerson } = database;

export const graphqlExpressMiddleware =
    graphqlExpress((request: express.Request, response: express.Response) => {
        try {
            const graphqlOptions: GraphQLOptions = {
                schema,
                context: {
                    persons,
                    findPerson,
                    addPerson,
                    Count: counterRepo,
                },
                formatError: error => {
                    logger.error('GraphQL execution error:', error);
                    return error;
                },
            };
            return graphqlOptions;
        } catch (e) {
            logger.error(e.stack);
        }
    });
