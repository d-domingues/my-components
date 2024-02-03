import { Meta, moduleMetadata, Story } from '@storybook/angular';
import { TimeInputComponent } from './time-input.component';
import { TimeInputModule } from './time-input.module';

export default {
    title: 'TimeInput',
    component: TimeInputComponent,
    decorators: [
        moduleMetadata({
            imports: [TimeInputModule],
        }),
    ],
} as Meta;

export const TimeInput: Story = () => ({});
