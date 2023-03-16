import type { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import { extendTheme } from "@chakra-ui/react";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

const colors = {
  text: "#02020A",
  primary: "#489dff",
  "primary.300": "#70b3ff",
  "primary.100": "#99C9FF",
  mockupGray: "##f8f8f9",
};

const fonts = {
  heading: `${inter.style.fontFamily},-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol"`,
  body: `${inter.style.fontFamily},-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol"`,
};

const theme = extendTheme({
  colors,
  fonts,
  styles: { global: { body: { color: colors.text } } },
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <Component {...pageProps} />
    </ChakraProvider>
  );
}
