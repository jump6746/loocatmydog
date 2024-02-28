import BigPhoto from './BigPhoto.tsx';

/**@type{import('@storybook/react').Meta} */
export default {
  component: BigPhoto,
  decorators: [
    (Story: any) => (
      <div style={{ inlineSize: '320px' }}>
        <Story />
      </div>
    ),
  ],
};

/**@type{import('@storybook/react').StoryObj} */
export const 기본표시 = {
  args: {
    type: 'default',
  },
};

export const 사진표시 = {
  args: {
    type: 'picture',
  },
};
