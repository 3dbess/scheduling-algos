import { createGlobalStyle, css } from 'styled-components';

import InterVarWoff2 from '../assets/fonts/Inter.var.woff2';

export const fontFaceRules = `
  @font-face {
    font-family: "Arial";
    src: url("${process.env.ASSET_PREFIX}${InterVarWoff2}") format('woff2 supports variations'),
         url("${process.env.ASSET_PREFIX}${InterVarWoff2}") format('woff2-variations');
    font-weight: 100 900;
  }
`;

const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
  }

  :root {
    font-size: 16px;
  }

  html,
  body {
    padding: 0;
    margin: 0;
    background-color: #D5F5E3;
    font-family:"Arial", sans-serif;
    font-size: 0.9rem;
    -webkit-font-smoothing: antialiased;
  }

  input, button {
    font-family: "Arial", sans-serif;
  }  

  a {
    color: inherit;
    text-decoration: none;
  }  

  button {
    border: none;
    font-size: 0.9rem;
    font-weight: 500;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    appearance: none;    
  }

  .container {
    width: 80%;
    max-width: 1255px;
    margin: auto;
  }

  .flex-center {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .swal-icon--error {
    width: 60px;
    height: 60px;
    margin-bottom: 10px;

    &__line {
      width: 27px;
      height: 4px;
      top: 29px;
    }
  }

  .swal-title {
    color: #333;
  }

  .swal-button {
    background-color: #26a5ff;
    transition: background-color 0.3s;

    &:not([disabled]):active, &:not([disabled]):hover {
      background-color: #0090ff;
    }
  }
  
  @media (max-width: 1150px) {
    h1 {
      font-size: 30px;
    }
  }
  @media (max-width: 600px) {
    h1 {
      font-size: 20px;
    }
    
    .container {
      width: 94%;
    }
  }
`;

const sizes = {
  '1275': 1275,
  '1150': 1150,
  '1050': 1050,
  '600': 600
};

export const media = Object.keys(sizes).reduce((acc, label) => {
  acc[label] = (...args: any[]) => css`
    @media (max-width: ${sizes[label] / 16}em) {      
      ${css.call(undefined, ...args)}
    }
  `;

  return acc;
}, {});

export default GlobalStyle;