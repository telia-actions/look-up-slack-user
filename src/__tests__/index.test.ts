import * as runner from '../runner';

jest.mock('../runner');

describe('index', () => {
  const runSpy = jest.spyOn(runner, 'run');

  it('should start runner', async () => {
    require('../index');

    expect(runSpy).toHaveBeenCalledTimes(1);
  });
});
