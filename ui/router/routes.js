import FeedsView from '~/views/FeedsView.vue';

export default [
  {
    path: '/',
    redirect: { name: 'feeds' },
  },
  {
    name: 'feeds',
    path: '/feeds',
    component: FeedsView,
  },
  {
    name: 'feeds.details',
    path: '/feeds/:id',
    component: FeedsView, // temp
  },
];
