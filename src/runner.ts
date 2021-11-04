import { setFailed, setOutput, getInput } from '@actions/core';
import { initializeClient, lookUpUserByEmail } from './services/slack-client';

export const run = async (): Promise<void> => {
  try {
    const email = getInput('email');
    const token = getInput('token');

    initializeClient({ token });

    const lookUpResponse = await lookUpUserByEmail({
      email,
    });

    if (lookUpResponse.ok) {
      setOutput('user', lookUpResponse.user);
    }
  } catch (e) {
    setFailed(e.message);
  }
};
