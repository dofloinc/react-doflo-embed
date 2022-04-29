import React from "react"; //eslint-disable-line no-unused-vars

import { storiesOf } from "@storybook/react";

//import JotformEmbed from '../lib/cjs/react-jotform-embed';
import DoFloEmbed from "../react-doflo-embed";

storiesOf("DoFloEmbed", module)
  .add("Simple (localhost)", () => (
    <DoFloEmbed src="http://localhost:3007/73244192d484358" />
  ))
  .add("Simple (prod)", () => (
    <DoFloEmbed src="https://forms.doflo.com/73244192d484358" />
  ))
  .add("Simple Name", () => (
    <DoFloEmbed src="https://forms.doflo.com/73d244192484358/" />
  ))
  .add("Hosted Form Pattern", () => (
    <DoFloEmbed src="https://forms.doflo.com/iframe/w/73d244192484358/" />
  ))
  .add("Simple Trailing Slash", () => (
    <DoFloEmbed src="https://forms.doflo.com/form/73d244192484358/" />
  ))
  .add("Scrollable", () => (
    <DoFloEmbed
      src="https://forms.doflo.com/form/732441924d84358/"
      scrolling={true}
    />
  ));
