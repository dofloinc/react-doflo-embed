# react-doflo-embed [![npm version](https://badge.fury.io/js/react-doflo-embed.svg)](https://www.npmjs.com/package/react-doflo-embed)

React component for embedding doFlo Objects [https://www.doflo.com/](https://www.doflo.com/)

## Install
```
npm install react-doflo-embed
```

## Usage
```jsx
import DoFloEmbed from 'react-doflo-embed';

<DoFloEmbed src="https://forms.doflo.com/123456789" />
```

## Props
- src : The url of your doFlo object, you can find this by clicking on the embed icon or the publish section depending on the element you are embedding. 
- scrolling : A boolean to allow or disallow scrolling.
- className : add any additional class values to the iframe itself

## Notes

To pre-populate variables such as in an embeddable form or application, add them as url params to your src URL. For example:

```jsx
let fName = encodeURIComponent("Joe");
let lName = encodeURIComponent("Takagi");
let company = encodeURIComponent("Nakatomi Corporation");
let title = encodeURIComponent("CEO");

<DoFloEmbed src={`https://forms.doflo.com/123456789/?fname=${fName}&lname=${lName}&co=${company}&title=${title}`} />
```

