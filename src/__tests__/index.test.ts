import * as githubAction from '../github-action';

jest.mock('../github-action');

describe('index', () => {
  const runSpy = jest.spyOn(githubAction, 'run');

  it('should start github action', async () => {
    require('../index');

    expect(runSpy).toHaveBeenCalledTimes(1);
  });
});
