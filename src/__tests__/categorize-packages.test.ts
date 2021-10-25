import { categorize } from '../categorize';
import * as actionsCore from '@actions/core';
import * as categorizePackages from '../features/notify-slack';
import { CategorizationResult } from '../features/notify-slack/types';

jest.mock('@actions/core');
jest.mock('../features/categorize-packages');

describe('categorize', () => {
  const package1 = {
    packageName: 'project1',
    projectFolder: 'projectFolder',
    shouldPublish: true,
  };

  const package2 = {
    packageName: 'project2',
    projectFolder: 'projectFolder',
    shouldPublish: false,
  };

  const getInputSpy = jest.spyOn(actionsCore, 'getInput');
  const setOutputSpy = jest.spyOn(actionsCore, 'setOutput');
  const setFailedSpy = jest.spyOn(actionsCore, 'setFailed');

  const categorizePackagesSpy = jest.spyOn(categorizePackages, 'notifySlack');

  it('should parse inputs and set outputs', async () => {
    const categorizationResult: CategorizationResult = {
      byDeployCategory: {
        category1: [package1],
        category2: [package2],
      },
      npmPublish: [package2],
    };

    const rushPackages = [package1, package2];

    getInputSpy.mockReturnValue(JSON.stringify(rushPackages));
    categorizePackagesSpy.mockReturnValue(categorizationResult);

    await categorize();

    expect(getInputSpy).toHaveBeenCalledTimes(1);
    expect(getInputSpy).toHaveBeenCalledWith('rushProjects');

    expect(categorizePackagesSpy).toHaveBeenCalledTimes(1);
    expect(categorizePackagesSpy).toHaveBeenCalledWith(rushPackages);

    expect(setOutputSpy).toHaveBeenCalledTimes(3);
    expect(setOutputSpy).toHaveBeenNthCalledWith(1, 'category1', [package1]);
    expect(setOutputSpy).toHaveBeenNthCalledWith(2, 'category2', [package2]);
    expect(setOutputSpy).toHaveBeenNthCalledWith(3, 'npm-package', [package2]);

    expect(setFailedSpy).toHaveBeenCalledTimes(0);
  });

  it('should set failure when error is encountered', async () => {
    const error = new Error('error');

    const rushPackages = [package1, package2];

    getInputSpy.mockReturnValue(JSON.stringify(rushPackages));
    categorizePackagesSpy.mockImplementation(() => {
      throw error;
    });

    await categorize();

    expect(getInputSpy).toHaveBeenCalledTimes(1);
    expect(getInputSpy).toHaveBeenCalledWith('rushProjects');

    expect(categorizePackagesSpy).toHaveBeenCalledTimes(1);
    expect(categorizePackagesSpy).toHaveBeenCalledWith(rushPackages);

    expect(setOutputSpy).toHaveBeenCalledTimes(0);

    expect(setFailedSpy).toHaveBeenCalledTimes(1);
    expect(setFailedSpy).toHaveBeenCalledWith(error.message);
  });
});
