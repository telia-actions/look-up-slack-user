import { run } from '../runner';
import * as actionsCore from '@actions/core';
import * as slackClient from '../util/slackClient';
import { UsersLookupByEmailResponse } from '@slack/web-api/dist/response/UsersLookupByEmailResponse';
import { mockPartial } from '../util/mocks';
import { when } from 'jest-when';

jest.mock('@actions/core');
jest.mock('../util/slackClient');

describe('runner', () => {
  const email = 'email';
  const token = 'token';

  const debugSpy = jest.spyOn(actionsCore, 'debug');
  const getInputSpy = jest.spyOn(actionsCore, 'getInput');
  const setOutputSpy = jest.spyOn(actionsCore, 'setOutput');
  const setFailedSpy = jest.spyOn(actionsCore, 'setFailed');

  const initializeClientSpy = jest.spyOn(slackClient, 'initializeClient');
  const lookUpUserByEmailSpy = jest.spyOn(slackClient, 'lookUpUserByEmail');

  beforeEach(() => {
    when(getInputSpy)
      .calledWith('email')
      .mockReturnValue(email)
      .calledWith('token')
      .mockReturnValue(token);
  });

  it('should get email from github inputs', async () => {
    const userResponse = mockPartial<UsersLookupByEmailResponse>({
      ok: true,
      user: {
        id: 'id',
      },
    });

    when(lookUpUserByEmailSpy).calledWith({ email }).mockResolvedValue(userResponse);

    await run();

    expect(getInputSpy).toHaveBeenCalledTimes(2);
    expect(getInputSpy).toHaveBeenCalledWith('email');
    expect(getInputSpy).toHaveBeenCalledWith('token');

    expect(initializeClientSpy).toHaveBeenCalledTimes(1);

    expect(lookUpUserByEmailSpy).toHaveBeenCalledTimes(1);
    expect(lookUpUserByEmailSpy).toHaveBeenCalledWith({ email });

    expect(setOutputSpy).toHaveBeenCalledTimes(1);
    expect(setOutputSpy).toHaveBeenCalledWith('user', userResponse.user);

    expect(debugSpy).toHaveBeenCalledTimes(0);

    expect(setFailedSpy).toHaveBeenCalledTimes(0);
  });

  it('should set debug message if look up request fails', async () => {
    const userResponse = mockPartial<UsersLookupByEmailResponse>({
      ok: false,
    });

    lookUpUserByEmailSpy.mockResolvedValue(userResponse);

    await run();

    expect(setOutputSpy).toHaveBeenCalledTimes(0);

    expect(debugSpy).toHaveBeenCalledTimes(1);
    expect(debugSpy).toHaveBeenCalledWith(`User with email: ${email} couldn't be resolved.`);

    expect(setFailedSpy).toHaveBeenCalledTimes(0);
  });

  it('should set failure when error is encountered', async () => {
    const error = new Error('Error');

    lookUpUserByEmailSpy.mockImplementation(() => {
      throw error;
    });

    await run();

    expect(setOutputSpy).toHaveBeenCalledTimes(0);

    expect(debugSpy).toHaveBeenCalledTimes(0);

    expect(setFailedSpy).toHaveBeenCalledTimes(1);
    expect(setFailedSpy).toHaveBeenCalledWith(error.message);
  });
});
