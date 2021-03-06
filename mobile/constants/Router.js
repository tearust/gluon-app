import React from 'react';
import {View} from 'react-native';
import {TabBarIcon, TabBarText} from '../components/TabBar';

import BtcHome from '../screens/btc/Home';

import ProfileHome from '../screens/profile/Profile';
import Layer1AccountProfile from '../screens/profile/Layer1AccountProfile';
import PairInfo from '../screens/profile/PairInfo';

import Test from '../screens/profile/test';
import LogView from '../screens/LogView';

import ScanQrCodeModal from '../screens/modals/ScanQrCodeModal';

import MockInputModal from '../screens/modals/MockInputModal';

export default {
  init_tab: 'tab_btc',
  tab: [
    {
      name: 'tab_btc',
      component: BtcHome,
      options: {
        title: ({focused}) => <TabBarText text={'Home'} focused={focused} />,
        tabBarIcon: ({focused}) => <TabBarIcon focused={focused} name="home" />,
      },
    },
    // {
    //   name: 'tab_calendar',
    //   component: ()=>null,
    //   options: {
    //     title: ({ focused })=><TabBarText text={'Calendar'} focused={focused} />,
    //     tabBarIcon: ({ focused }) => <TabBarIcon size={25} focused={focused} name="calendar-o" />
    //   }
    // },
    {
      name: 'tab_profile',
      component: ProfileHome,
      options: {
        title: ({focused}) => <TabBarText text={'Profile'} focused={focused} />,
        tabBarIcon: ({focused}) => (
          <TabBarIcon size={21} focused={focused} name="user-o" />
        ),
      },
    },
    {
      name: 'tab_test',
      component: Test,
      options: {
        title: ({focused}) => <TabBarText text={'Test'} focused={focused} />,
        tabBarIcon: ({focused}) => (
          <TabBarIcon size={21} focused={focused} name="user-o" />
        ),
      },
    },
  ],
  modal: [
    {
      name: 'scan_qr_code_modal',
      component: ScanQrCodeModal,
      options: {
        headerBackTitle: '',
        headerTitle: '',
        headerShown: false,
      },
    },
    {
      name: 'mock_input_modal',
      component: MockInputModal,
      options: {
        headerBackTitle: '',
        headerTitle: '',
        headerShown: false,
      },
    },

  ],

  stack: [
    {
      name: 'layer1_account_profile',
      component: Layer1AccountProfile,
    },
    {
      name: 'pair_info_profile',
      component: PairInfo,
    },
    {
      name: 'log_view',
      component: LogView,
    },

  ],
};
