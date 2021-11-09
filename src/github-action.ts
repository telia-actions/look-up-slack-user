import { debug, setFailed, setOutput, getInput } from '@actions/core';
import { createAppContainer } from './app';

export const run = async (): Promise<void> => {
  try {
    const email = getInput('email');
    const token = getInput('token');

    const { slackClient } = createAppContainer({
      slackToken: token,
    });

    const lookUpResponse = await slackClient.lookUpUserByEmail({
      email,
    });

    if (lookUpResponse.ok) {
      setOutput('user', lookUpResponse.user);
    } else {
      debug(`User with email: ${email} couldn't be resolved.`);
    }
  } catch (e) {
    setFailed(e.message);
  }
};
