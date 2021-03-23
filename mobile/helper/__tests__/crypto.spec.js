import crypto from '../crypto';

describe('test helper/crypto', () => {
  test('it should correct result for sha256', () => {
    const rs = crypto.sha256('gluon');

    expect(rs.toHex()).toEqual(
      'f7d0155b0c0fe9a7d2d9fb30d57b2a7eda30d4610be7c4d321203562dcc62efe',
    );
  });

  test('it should correct result for aes encrypted and decrypted', () => {
    const data = 'gluon';
    const password = 'pwd';

    const encrypted = crypto.aes(password, data);
    const decrypted = crypto.des(password, encrypted);

    expect(decrypted).toEqual(data);
  });
});
