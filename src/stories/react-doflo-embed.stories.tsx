import React from "react"; //eslint-disable-line no-unused-vars

import { storiesOf } from "@storybook/react";
import useDimension from "./dimensions";

//import JotformEmbed from '../lib/cjs/react-jotform-embed';
import DoFloEmbed from "../react-doflo-embed";

storiesOf("DoFloEmbed", module)
  .add("Simple (localhost min height window)", () => {
    const [ref, { height }] = useDimension({ liveMeasure: true });

    return (
      <div ref={ref} style={{ height: "calc(100vh - 42px)" }}>
        <DoFloEmbed
          onEvent={(e) => {
            console.log(e.message);
          }}
          minHeight={height}
          src="http://localhost:3007/7b6c19b2-4efd-411e-b7d9-d46b283a19b9"
        />
      </div>
    );
  })

  .add("Simple (localhost)", () => {
    // const [ref, { height }] = useDimension({ liveMeasure: true });

    return (
      <DoFloEmbed src="http://localhost:3007/7b6c19b2-4efd-411e-b7d9-d46b283a19b9" />
    );
  })

  .add("Simple (prod)", () => (
    <DoFloEmbed src="https://forms.doflo.com/73244192d484358" />
  ))
  .add(
    "Simple (stage)",
    () => (
      <DoFloEmbed
        minHeight={3000}
        src="https://forms.stage-doflo.com/7b6c19b2-4efd-411e-b7d9-d46b283a19b9"
      />
    ),
    {
      disabled: {
        description: "Disable mode for the button",
        table: { category: "format" },
      },
      loading: {
        description: "Loading mode for the button",
        table: { category: "format" },
      },
    }
  )
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
