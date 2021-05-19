import store from '../index';
import {_} from 'tearust_utils/index.cjs';

jest.mock('../../workflow/Base', ()=>{
  return class {
    init(){}
  };
});

describe('test vuex store', ()=>{

  const init_store = ()=>{
    const s = _.clone(store);

    return s;
  };

  test('it should be correct result for layer1 account', ()=>{

    const s = init_store();

    s.commit('set_account', {
      ori_name: 'name',
      address: 'address',
      balance: 100
    });

    expect(s.state.layer1_account.balance).toEqual(100);
    expect(s.state.layer1_account.name).toEqual('name');
    expect(s.state.layer1_account.address).toEqual('address');
  });

  test('it should be correct result for bind mobile info', ()=>{
    const s = init_store();

    s.commit('set_bind_mobile', {
      address: 'address',
      uuid: 'uuid'
    });

    expect(s.state.bind_mobile.address).toEqual('address');
    expect(s.state.bind_mobile.uuid).toEqual('uuid');
  })
});