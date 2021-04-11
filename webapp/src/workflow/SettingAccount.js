import Base from './Base';

export default class extends Base {
  defineLog(){
    return 'SettingAccount';
  }

  async getAllLayer1Account(){
    const layer1_instance = this.getLayer1Instance();
    const all_account = await layer1_instance.extension.getAllAccounts();

    return all_account;
  }

}