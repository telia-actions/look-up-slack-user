import { createSlackClient } from '../slack-client';
import { mockPartial } from '../../mocks';
import { LookUpUserByEmailOptions } from '../types';
import { UsersLookupByEmailResponse } from '@slack/web-api/dist/response/UsersLookupByEmailResponse';
import { WebAPIPlatformError } from '@slack/web-api/dist/errors';
import { WebClient } from '@slack/web-api';

describe('slack-client', () => {
  const lookupByEmailMock = jest.fn();

  const slackWebClient = mockPartial<WebClient>({
    users: {
      lookupByEmail: lookupByEmailMock,
    },
  });

  const options = mockPartial<LookUpUserByEmailOptions>({
    email: 'email',
  });

  const slackClient = createSlackClient({ slackWebClient });

  describe('lookUpUserByEmail', () => {
    it('should look up user info', async () => {
      const response = mockPartial<UsersLookupByEmailResponse>({
        ok: true,
      });

      lookupByEmailMock.mockResolvedValue(response);

      const result = await slackClient.lookUpUserByEmail(options);

      expect(result).toBe(response);

      expect(lookupByEmailMock).toHaveBeenCalledTimes(1);
      expect(lookupByEmailMock).toHaveBeenCalledWith(options);
    });

    it('should resolve when user look up fails with "users_not_found" error', async () => {
      const response = mockPartial<WebAPIPlatformError>({
        data: {
          ok: false,
          error: 'users_not_found',
        },
      });

      lookupByEmailMock.mockRejectedValue(response);

      const result = await slackClient.lookUpUserByEmail(options);

      expect(result).toBe(response.data);

      expect(lookupByEmailMock).toHaveBeenCalledTimes(1);
      expect(lookupByEmailMock).toHaveBeenCalledWith(options);
    });

    it('should reject when user look up fails with error other than"users_not_found"', async () => {
      const response = mockPartial<WebAPIPlatformError>({
        data: {
          ok: false,
          error: 'some_error',
        },
      });

      lookupByEmailMock.mockRejectedValue(response);

      await expect(slackClient.lookUpUserByEmail(options)).rejects.toBe(response);
    });

    it('should reject when user look up fails with error without data', async () => {
      const response = mockPartial<WebAPIPlatformError>({});

      lookupByEmailMock.mockRejectedValue(response);

      await expect(slackClient.lookUpUserByEmail(options)).rejects.toBe(response);
    });
  });
});
