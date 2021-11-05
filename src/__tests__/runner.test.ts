import { run } from '../runner';
import * as actionsCore from '@actions/core';
import * as slackClient from '../utils/slackClient';
import { UsersLookupByEmailResponse } from '@slack/web-api/dist/response/UsersLookupByEmailResponse';
import { mockPartial } from '../utils/mocks';
import { when } from 'jest-when';

jest.mock('@actions/core');
jest.mock('../utils/slackClient');

describe('runner', () => {
  const email = 'email';
  const token = 'token';

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

  it('should parse inputs and set outputs', async () => {
    const userResponse = mockPartial<UsersLookupByEmailResponse>({
      ok: true,
      user: {
        id: 'id',
      },
    });

    lookUpUserByEmailSpy.mockResolvedValue(userResponse);

    await run();

    expect(getInputSpy).toHaveBeenCalledTimes(2);
    expect(getInputSpy).toHaveBeenCalledWith('email');
    expect(getInputSpy).toHaveBeenCalledWith('token');

    expect(initializeClientSpy).toHaveBeenCalledTimes(1);

    expect(lookUpUserByEmailSpy).toHaveBeenCalledTimes(1);
    expect(lookUpUserByEmailSpy).toHaveBeenCalledWith({ email });

    expect(setOutputSpy).toHaveBeenCalledTimes(1);
    expect(setOutputSpy).toHaveBeenCalledWith('user', userResponse.user);

    expect(setFailedSpy).toHaveBeenCalledTimes(0);
  });

  it('should not set output if look up request fails', async () => {
    const userResponse = mockPartial<UsersLookupByEmailResponse>({
      ok: false,
    });

    lookUpUserByEmailSpy.mockResolvedValue(userResponse);

    await run();

    expect(getInputSpy).toHaveBeenCalledTimes(2);
    expect(getInputSpy).toHaveBeenCalledWith('email');
    expect(getInputSpy).toHaveBeenCalledWith('token');

    expect(initializeClientSpy).toHaveBeenCalledTimes(1);

    expect(lookUpUserByEmailSpy).toHaveBeenCalledTimes(1);
    expect(lookUpUserByEmailSpy).toHaveBeenCalledWith({ email });

    expect(setOutputSpy).toHaveBeenCalledTimes(0);

    expect(setFailedSpy).toHaveBeenCalledTimes(0);
  });

  it('should set failure when error is encountered', async () => {
    const userResponse = mockPartial<UsersLookupByEmailResponse>({
      ok: false,
    });

    const error = new Error('Error');

    lookUpUserByEmailSpy.mockImplementation(() => {
      throw error;
    });

    await run();

    expect(getInputSpy).toHaveBeenCalledTimes(2);
    expect(getInputSpy).toHaveBeenCalledWith('email');
    expect(getInputSpy).toHaveBeenCalledWith('token');

    expect(initializeClientSpy).toHaveBeenCalledTimes(1);

    expect(lookUpUserByEmailSpy).toHaveBeenCalledTimes(1);
    expect(lookUpUserByEmailSpy).toHaveBeenCalledWith({ email });

    expect(setOutputSpy).toHaveBeenCalledTimes(0);

    expect(setFailedSpy).toHaveBeenCalledTimes(1);
    expect(setFailedSpy).toHaveBeenCalledWith(error.message);
  });
});
