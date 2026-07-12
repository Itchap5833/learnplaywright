import { expect, test } from '../test-setup';
import { LoginPageSauceDemo } from '../pages/loginpagesaucedemo.page';

import path from 'path';
import {readCSV, LoginData } from '../utils/csvReader';

/*
type LoginData = {
    username: string;
    password: string;
    run: string;
    expected: string;
};
*/

//const loginData = readCSV(path.join(__dirname, 'test-data', 'LoginData.csv')) as LoginData[];

const testData: LoginData[] = readCSV(path.join(__dirname, 'test-data', 'LoginData.csv'));

test.describe('Login Tests for csv reader', () => {

    for (const data of testData) {

        test(`Login test for - ${data.username}`, async ({ page }) => {

            test.skip(data.run !== 'yes', 'Run Flag=NO');

            const loginPage = new LoginPageSauceDemo(page);

            await test.step('Go to login page', async () => {
                await loginPage.navigate();
            });

            await test.step('Perform Login', async () => {
                await loginPage.login(data.username, data.password);
            });

            await test.step('Validate Result', async () => {
                if (data.expected === 'success') {
                    await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
                } else {
                    await expect(loginPage.errorMessage).toBeVisible();
                }
            });
        });
    }

});

/*

loginData.forEach((data: LoginData) => {

    if (data.run !== 'true') return;

    test(`Login Test - ${data.username}`, async ({ page }) => {

        const loginPage = new LoginPageSauceDemo(page);
        await loginPage.navigate();
        await loginPage.login(data.username, data.password);

        if (data.expected === 'success') {
            await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
        } else {
            await expect(loginPage.errorMessage).toBeVisible();
        }

    });
});

*/