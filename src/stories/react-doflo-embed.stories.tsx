import React from 'react'; //eslint-disable-line no-unused-vars

import { storiesOf } from '@storybook/react';

//import JotformEmbed from '../lib/cjs/react-jotform-embed';
import DoFloEmbed from '../react-doflo-embed';

storiesOf('DoFloEmbed', module)
.add('Simple', () => <DoFloEmbed src="https://forms.doflo.com/iframe/73244192484358" />)
.add('Simple Trailing Slash', () => <DoFloEmbed src="https://forms.doflo.com/iframe/73244192484358/" />)
.add('Scrollable', () => <DoFloEmbed src="https://forms.doflo.com/iframe/73244192484358/" scrolling={true} />);
