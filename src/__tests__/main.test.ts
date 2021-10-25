import * as categorize from '../categorize';

jest.mock('../categorize');

describe('main', () => {
  const categorizeSpy = jest.spyOn(categorize, 'categorize');

  it('should start uploading packages', async () => {
    require('../main');

    expect(categorizeSpy).toHaveBeenCalledTimes(1);
  });
});
