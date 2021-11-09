import { run } from '../github-action';
import * as actionsCore from '@actions/core';
import * as app from '../app';
import { UsersLookupByEmailResponse } from '@slack/web-api/dist/response/UsersLookupByEmailResponse';
import { mockPartial } from '../util/mocks';
import { when } from 'jest-when';
import { SlackClient } from '../util/slack-client';
import { createAppContainer } from '../app';

jest.mock('@actions/core');
jest.mock('../app');

describe('github action', () => {
  const email = 'email';
  const token = 'token';

  const debugSpy = jest.spyOn(actionsCore, 'debug');
  const getInputSpy = jest.spyOn(actionsCore, 'getInput');
  const setOutputSpy = jest.spyOn(actionsCore, 'setOutput');
  const setFailedSpy = jest.spyOn(actionsCore, 'setFailed');

  const lookUpUserByEmailMock = jest.fn();

  const client = mockPartial<SlackClient>({
    lookUpUserByEmail: lookUpUserByEmailMock,
  });

  const createAppContainerSpy = jest.spyOn(app, 'createAppContainer');

  beforeEach(() => {
    when(getInputSpy)
      .calledWith('email')
      .mockReturnValue(email)
      .calledWith('token')
      .mockReturnValue(token);

    createAppContainerSpy.mockReturnValue({
      slackClient: client,
    });
  });

  it('should get email from github inputs', async () => {
    const userResponse = mockPartial<UsersLookupByEmailResponse>({
      ok: true,
      user: {
        id: 'id',
      },
    });

    when(client.lookUpUserByEmail).calledWith({ email }).mockResolvedValue(userResponse);

    await run();

    expect(getInputSpy).toHaveBeenCalledTimes(2);
    expect(getInputSpy).toHaveBeenCalledWith('email');
    expect(getInputSpy).toHaveBeenCalledWith('token');

    expect(createAppContainerSpy).toHaveBeenCalledTimes(1);
    expect(createAppContainerSpy).toHaveBeenCalledWith({
      slackToken: token,
    });

    expect(lookUpUserByEmailMock).toHaveBeenCalledTimes(1);
    expect(lookUpUserByEmailMock).toHaveBeenCalledWith({ email });

    expect(setOutputSpy).toHaveBeenCalledTimes(1);
    expect(setOutputSpy).toHaveBeenCalledWith('user', userResponse.user);

    expect(debugSpy).toHaveBeenCalledTimes(0);

    expect(setFailedSpy).toHaveBeenCalledTimes(0);
  });

  it('should set debug message if look up request fails', async () => {
    const userResponse = mockPartial<UsersLookupByEmailResponse>({
      ok: false,
    });

    lookUpUserByEmailMock.mockResolvedValue(userResponse);

    await run();

    expect(setOutputSpy).toHaveBeenCalledTimes(0);

    expect(debugSpy).toHaveBeenCalledTimes(1);
    expect(debugSpy).toHaveBeenCalledWith(`User with email: ${email} couldn't be resolved.`);

    expect(setFailedSpy).toHaveBeenCalledTimes(0);
  });

  it('should set failure when error is encountered', async () => {
    const error = new Error('Error');

    lookUpUserByEmailMock.mockImplementation(() => {
      throw error;
    });

    await run();

    expect(setOutputSpy).toHaveBeenCalledTimes(0);

    expect(debugSpy).toHaveBeenCalledTimes(0);

    expect(setFailedSpy).toHaveBeenCalledTimes(1);
    expect(setFailedSpy).toHaveBeenCalledWith(error.message);
  });
});
