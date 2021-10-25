import { setFailed, setOutput, getInput } from '@actions/core';
import { initializeClient, lookUpUserByEmail } from './services/slack-client';

export const run = async (): Promise<void> => {
  try {
    const email = getInput('email');
    const token = getInput('token');

    initializeClient({ token });

    const response = await lookUpUserByEmail({
      email,
    });

    setOutput('user', response.user);
  } catch (e) {
    setFailed(e.message);
  }
};
