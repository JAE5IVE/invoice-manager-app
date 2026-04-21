import { ThemeProvider } from "./context/ThemeContext";
import { InvoiceProvider } from "./context/InvoiceContext";
import Layout from "./components/Layout";
import InvoiceList from "./components/InvoiceList";

export default function App() {
  return (
    <ThemeProvider>
      <InvoiceProvider>
        <Layout>
          <InvoiceList />
        </Layout>
      </InvoiceProvider>
    </ThemeProvider>
  );
}
