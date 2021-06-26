import { mount } from '@vue/test-utils';
import App from '@/App.vue';

describe('App.vue', () => {
  it('should mount the app without crashing', () => {
    mount(App);
  });
});
