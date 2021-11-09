import { LookUpUserByEmailOptions, SlackClientArgs } from './types';

export const createSlackClient = ({ slackWebClient }: SlackClientArgs) => {
  const lookUpUserByEmail = async (options: LookUpUserByEmailOptions) => {
    try {
      return await slackWebClient.users.lookupByEmail(options);
    } catch (e) {
      if (e.data?.error === 'users_not_found') {
        return e.data;
      }

      throw e;
    }
  };

  return { lookUpUserByEmail };
};

export type SlackClient = ReturnType<typeof createSlackClient>;
